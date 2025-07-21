# This is a program that predicts if passengers survived on the Titanic
# We will use different machine learning models to make predictions

# First, let's import all the libraries we need
import pandas as pd  # for working with data tables
import numpy as np   # for math operations
import random as rnd # might need this later idk

# These help us make pretty graphs
import seaborn as sns  
import matplotlib.pyplot as plt

from pickle import dump  # to save models

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier  
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB  
from sklearn.linear_model import Perceptron, SGDClassifier
from sklearn.svm import SVC, LinearSVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


import os

# Step 1: Create folders to save our work
print("Creating folders to save our work...")
model_folder = 'predictionmodels'
predictions_folder = 'predictions'

# Make the folders if they don't exist already
if not os.path.exists(model_folder):
    os.makedirs(model_folder)
if not os.path.exists(predictions_folder):
    os.makedirs(predictions_folder)

# Step 2: Load our training and testing data
print("Loading the Titanic dataset...")
training_data = pd.read_csv('web-backend/app/train.csv')
testing_data = pd.read_csv('model-backend/test.csv')

# Step 3: Clean up our data
def preprocess_data(data):
    """This function cleans up our messy data"""
    print("Cleaning up the data...")

    # Convert male/female to numbers (0 for boys, 1 for girls)
    data['Sex'] = data['Sex'].map({'male': 0, 'female': 1})

    # Fix: Avoid chained assignment by using direct assignment
    data['Age'] = data['Age'].fillna(data['Age'].median())
    data['Fare'] = data['Fare'].fillna(data['Fare'].median())
    data['Embarked'] = data['Embarked'].fillna(data['Embarked'].mode()[0])

    # Convert ports to numbers
    data['Embarked'] = data['Embarked'].map({'C': 0, 'Q': 1, 'S': 2})

    return data


# Clean both sets of data
training_data = preprocess_data(training_data)
testing_data = preprocess_data(testing_data)

# Step 4: Choose which information to use for prediction
print("Preparing data for our models...")

# Correct feature set with 7 features
important_features = ['Pclass', 'Sex', 'Age', 'Fare', 'SibSp', 'Parch', 'Embarked']

# Separate our data into features (X) and what we want to predict (y)
X_train = training_data[important_features]
y_train = training_data['Survived']
X_test = testing_data[important_features]

# Step 5: Set up our different machine learning models
print("Setting up our prediction models...")

all_models = {
    "Logistic Regression": LogisticRegression(max_iter=200),
    "Support Vector Machine": make_pipeline(StandardScaler(), SVC(probability=True, class_weight='balanced')),
    "Decision Tree": DecisionTreeClassifier(class_weight='balanced', max_depth=5, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
}


# Mapping for saving models with capitalized names and underscores
model_file_names = {
    "Logistic Regression": "Logistic_Regression.pkl",
    "Support Vector Machine": "Support_Vector_Machine.pkl",
    "Decision Tree": "Decision_Tree.pkl",
    "Random Forest": "Random_Forest.pkl"
}

# Step 6: Train models and make predictions
print("Training models and making predictions...")
all_predictions = {}

for model_name, model in all_models.items():
    print(f"\nWorking on {model_name}...")
    
    # Train the model
    model.fit(X_train, y_train)
    
    # Save the trained model with corrected file name
    print(f"Saving {model_name} to file...")
    file_name = model_file_names[model_name]
    with open(f'{model_folder}/{file_name}', 'wb') as model_file:
        dump(model, model_file)
    
    # Make predictions
    print(f"Making predictions with {model_name}...")
    all_predictions[model_name] = model.predict(X_test)
    
    # Show first few predictions
    print(f"First 10 predictions from {model_name}:", all_predictions[model_name][:10])

# Step 7: Save all predictions to files
print("\nSaving all predictions to files...")
for model_name, predictions in all_predictions.items():
    results = pd.DataFrame({
        'PassengerId': testing_data['PassengerId'],
        'Survived': predictions
    })
    
    file_name = f'{predictions_folder}/{model_file_names[model_name].replace(".pkl", "_predictions.csv")}'
    results.to_csv(file_name, index=False)
    print(f"Saved predictions for {model_name} to {file_name}")

print("\nAll done! 🎉")