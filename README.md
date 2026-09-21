<<<<<<< HEAD
# House Price Prediction using Machine Learning

# Project Overview

In this project, I built a machine learning model to predict house prices using various numerical and categorical features. The goal was to perform proper data preprocessing, apply feature transformations, compare multiple regression models, and select the best-performing model based on evaluation metrics.

# Dataset Description

The dataset contains information related to residential properties such as:

Number of rooms

Distance from city center

Land size and building area

Property type and region

Sale price (target variable)

Some irrelevant columns like address, seller name, date, and postcode were removed to reduce noise.

# Data Preprocessing
Handling Missing Values

Numerical columns like Car, BuildingArea, and YearBuilt were filled using their mean values.

The categorical column CouncilArea was filled using the most frequent category.

Data types were corrected where required.

# Exploratory Data Analysis (EDA)

Several numerical features showed heavy right skewness, especially:

Distance

Landsize

BuildingArea

To address this, I applied a log1p transformation and visualized the distributions before and after transformation in a single figure.
This helped confirm that skewness was reduced and variance was stabilized, making the data more suitable for regression models.

# Feature Engineering & Pipelines
Numerical Features

Log transformation (log1p)

Standard scaling (StandardScaler)

Categorical Features

One-hot encoding (OneHotEncoder)

To avoid data leakage and ensure consistency, I used Scikit-learn Pipelines and ColumnTransformer to apply preprocessing and modeling in a single workflow.

# Models Used

I trained and compared the following regression models:

Linear Regression

Decision Tree Regressor

Random Forest Regressor

SGD Regressor

All models were trained using the same preprocessing pipeline for fair comparison.

# Model Evaluation
Metrics Used

MAE (Mean Absolute Error)

MSE (Mean Squared Error)

R² Score

Cross-validation R² (5-fold)

A comparison table was created, and model performance was visualized using a bar plot based on R² score.

# Results & Observations

Random Forest Regressor achieved the highest R² score, indicating better ability to capture complex relationships.

Tree-based models performed better than linear models, even after log transformation.

SGD Regressor showed weaker performance, likely due to sensitivity to hyperparameters and data distribution.

# Conclusion

This project demonstrates the importance of:

Proper data cleaning and preprocessing

Feature transformation backed by visualization

Using pipelines to prevent data leakage

Comparing multiple models before final selection

Based on the evaluation metrics, Random Forest Regressor was selected as the final model for house price prediction.
=======
>>>>>>> b102df9 (Added API and Frontend)
