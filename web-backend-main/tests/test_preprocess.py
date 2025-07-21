# In backend/tests/test_preprocess.py

import numpy as np
import pytest
# Make sure to import your actual preprocess function
from app.preprocess import preprocess

# Helper Class to create "fake" passenger objects for testing
# This simulates the structure of the data your function expects.
class MockPassenger:
    def __init__(self, Title, Pclass, Sex, Age, Fare, IsAlone, Embarked, AgeClass):
        self.Title = Title
        self.Pclass = Pclass
        self.Sex = Sex
        self.Age = Age
        self.Fare = Fare
        self.IsAlone = IsAlone
        self.Embarked = Embarked
        self.AgeClass = AgeClass

def test_preprocess_for_mr():
    """
    Tests the preprocessing for a standard passenger with the title "Mr."
    """
    # 1. Arrange: Create a sample passenger object
    passenger = MockPassenger(
        Title="Mr.",
        Pclass=3,
        Sex=0, # Assuming 0 is male
        Age=35,
        Fare=7.5,
        IsAlone=1, # Assuming 1 is true
        Embarked=0,
        AgeClass=2
    )

    # 2. Act: Call the function we are testing
    result_data = preprocess(passenger)

    # 3. Assert: Check if the output is what we expect
    # The title "Mr." should be mapped to 0
    expected_data = np.array([[0, 3, 0, 35, 7.5, 1, 0, 2]])

    # Use numpy's testing function to compare arrays
    np.testing.assert_array_equal(result_data, expected_data)

def test_preprocess_for_unknown_title():
    """
    Tests that a title not in the title_map is correctly handled and mapped to -1.
    This is an important edge case.
    """
    # 1. Arrange: Create a passenger with an unknown title like "Dr."
    passenger = MockPassenger(
        Title="Dr.", # This title is not in the map
        Pclass=1,
        Sex=0,
        Age=50,
        Fare=100.0,
        IsAlone=0,
        Embarked=1,
        AgeClass=3
    )

    # 2. Act
    result_data = preprocess(passenger)

    # 3. Assert
    # The title "Dr." should be mapped to the default value -1
    expected_data = np.array([[-1, 1, 0, 50, 100.0, 0, 1, 3]])
    np.testing.assert_array_equal(result_data, expected_data)

def test_preprocess_output_properties():
    """
    Tests that the output from the preprocess function has the correct shape and data type.
    """
    # 1. Arrange
    passenger = MockPassenger("Miss", 2, 1, 22, 30.0, 0, 1, 1)

    # 2. Act
    result_data = preprocess(passenger)

    # 3. Assert
    assert isinstance(result_data, np.ndarray) # Check if it's a numpy array
    assert result_data.shape == (1, 8)         # Check if the shape is (1, 8)