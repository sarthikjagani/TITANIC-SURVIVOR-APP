import os
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
import joblib

def preprocess_data(df):
    """Takes a raw dataframe and returns a preprocessed dataframe ready for training."""
    # Drop features that are not required
    df = df.drop(['Ticket', 'Cabin'], axis=1)

    # Create new feature: Title
    df['Title'] = df.Name.str.extract(r' ([A-Za-z]+)\.', expand=False)
    df['Title'] = df['Title'].replace(['Lady', 'Countess', 'Capt', 'Col', 'Don', 'Dr', 'Major', 'Rev', 'Sir', 'Jonkheer', 'Dona'], 'Rare')
    df['Title'] = df['Title'].replace('Mlle', 'Miss')
    df['Title'] = df['Title'].replace('Ms', 'Miss')
    df['Title'] = df['Title'].replace('Mme', 'Mrs')
    title_mapping = {"Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5}
    df['Title'] = df['Title'].map(title_mapping).fillna(0)
    df = df.drop(['Name', 'PassengerId'], axis=1)

    # Convert Sex feature to numerical
    df['Sex'] = df['Sex'].map({'female': 1, 'male': 0}).astype(int)

    # Guess missing Age values
    guess_ages = np.zeros((2, 3))
    for i in range(0, 2):
        for j in range(0, 3):
            guess_df = df[(df['Sex'] == i) & (df['Pclass'] == j + 1)]['Age'].dropna()
            age_guess = guess_df.median()
            
            # THIS IS THE FIX: Check if age_guess is NaN before using it.
            if pd.isna(age_guess):
                guess_ages[i, j] = 0  # Use a fallback value of 0
            else:
                guess_ages[i, j] = int(age_guess / 0.5 + 0.5) * 0.5

    for i in range(0, 2):
        for j in range(0, 3):
            df.loc[(df.Age.isnull()) & (df['Sex'] == i) & (df['Pclass'] == j + 1), 'Age'] = guess_ages[i, j]
    df['Age'] = df['Age'].astype(int)

    # Create Age bands
    df.loc[df['Age'] <= 16, 'Age'] = 0
    df.loc[(df['Age'] > 16) & (df['Age'] <= 32), 'Age'] = 1
    df.loc[(df['Age'] > 32) & (df['Age'] <= 48), 'Age'] = 2
    df.loc[(df['Age'] > 48) & (df['Age'] <= 64), 'Age'] = 3
    df.loc[df['Age'] > 64, 'Age'] = 4

    # Create FamilySize and IsAlone features
    df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
    df['IsAlone'] = 0
    df.loc[df['FamilySize'] == 1, 'IsAlone'] = 1
    df = df.drop(['Parch', 'SibSp', 'FamilySize'], axis=1)

    # Create Age*Class feature
    df['Age*Class'] = df.Age * df.Pclass

    # Fill missing Embarked values
    freq_port = df.Embarked.dropna().mode()[0]
    df['Embarked'] = df['Embarked'].fillna(freq_port)
    df['Embarked'] = df['Embarked'].map({'S': 0, 'C': 1, 'Q': 2}).astype(int)

    # Fill missing Fare values and create bands
    df['Fare'] = df['Fare'].fillna(df['Fare'].dropna().median())
    df.loc[df['Fare'] <= 7.91, 'Fare'] = 0
    df.loc[(df['Fare'] > 7.91) & (df['Fare'] <= 14.454), 'Fare'] = 1
    df.loc[(df['Fare'] > 14.454) & (df['Fare'] <= 31), 'Fare'] = 2
    df.loc[df['Fare'] > 31, 'Fare'] = 3
    
    return df

def train_and_save_models(df, models_dir):
    """Trains models and saves them to the specified directory."""
    X_train = df.drop("Survived", axis=1)
    Y_train = df["Survived"]

    models = {
        "logistic_regression": LogisticRegression(max_iter=200),
        "svm": SVC(probability=True),
        "knn": KNeighborsClassifier(n_neighbors=3),
        "random_forest": RandomForestClassifier(n_estimators=100),
        "decision_tree": DecisionTreeClassifier()
    }

    os.makedirs(models_dir, exist_ok=True)

    for name, model in models.items():
        print(f"Training {name} model...")
        model.fit(X_train, Y_train)
        joblib.dump(model, f"{models_dir}/{name}_model.pkl")
        print(f"{name} model saved successfully.")

# This block allows the script to be run directly
if __name__ == "__main__":
    # Load the training dataset
    train_df = pd.read_csv('model-backend/train.csv')
    
    # Process the data
    processed_df = preprocess_data(train_df.copy()) # Use a copy to be safe
    
    # Define where to save the final models
    output_models_dir = "model-backend/models"
    
    # Train and save the models
    train_and_save_models(processed_df, output_models_dir)
    
    print("All models trained and saved successfully.")