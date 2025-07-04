import pytest
import pandas as pd
from train import preprocess_data, train_and_save_models

def test_preprocess_data():
    """
    Unit test for the data preprocessing logic.
    """
    # Create a small, sample DataFrame with raw data
    raw_data = {
        'PassengerId': [1, 2],
        'Name': ['Owen Harris, Mr. L.', 'Heikkinen, Miss. Laina'],
        'Sex': ['male', 'female'],
        'Age': [22, 38],
        'SibSp': [1, 1],
        'Parch': [0, 0],
        'Ticket': ['A/5 21171', 'PC 17599'],
        'Fare': [7.25, 71.2833],
        'Cabin': [None, 'C85'],
        'Embarked': ['S', 'C'],
        'Pclass': [3, 1],
        'Survived': [0, 1] # Include Survived column for completeness
    }
    sample_df = pd.DataFrame(raw_data)
    
    # Process the data using our function
    processed_df = preprocess_data(sample_df)

    # Assertions: Check if the preprocessing worked as expected
    assert 'Ticket' not in processed_df.columns
    assert 'Name' not in processed_df.columns
    assert 'Sex' in processed_df.columns and processed_df['Sex'].dtype == 'int'
    assert 'IsAlone' in processed_df.columns
    assert 'Age*Class' in processed_df.columns
    assert processed_df.isnull().sum().sum() == 0 # Check that there are no missing values left

def test_train_and_save_models(tmp_path):
    """
    Integration test to ensure models are created.
    'tmp_path' is a special pytest fixture that provides a temporary directory.
    """
    # Create a minimal, preprocessed DataFrame for training
    train_data = {
        'Survived': [0, 1, 1, 0],
        'Pclass': [3, 1, 3, 1],
        'Sex': [0, 1, 1, 0],
        'Age': [1, 2, 1, 2],
        'Fare': [0, 3, 1, 3],
        'Embarked': [0, 1, 0, 1],
        'Title': [1, 3, 2, 1],
        'IsAlone': [0, 0, 1, 1],
        'Age*Class': [3, 2, 3, 2]
    }
    sample_df = pd.DataFrame(train_data)
    
    # Use the temporary directory provided by pytest as the output folder
    models_dir = tmp_path / "models"
    
    # Run our training and saving function
    train_and_save_models(sample_df, str(models_dir))
    
    # Assert that the model files were actually created
    assert (models_dir / "logistic_regression_model.pkl").exists()
    assert (models_dir / "random_forest_model.pkl").exists()