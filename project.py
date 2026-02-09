

import pandas as  pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, FunctionTransformer, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression, SGDRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score

df = pd.read_csv("house_data.csv")



df_new = df.copy()

df.drop(columns = ["Address", "SellerG", "Date", "Postcode", "Propertycount"], inplace = True)
# Handling Missing Values
print(df.isnull().sum())
df["Car"] = df["Car"].fillna(df["Car"].mean())
df["BuildingArea"] = df["BuildingArea"].fillna(df["BuildingArea"].mean())

# df["Lattitude"] = df["Lattitude"].fillna(df["Lattitude"].mean())
# df["Longtitude"] = df["Longtitude"].fillna(df["Longtitude"].mean())


df["YearBuilt"] = df["YearBuilt"].fillna(df["YearBuilt"].mean()).astype(int)
df["CouncilArea"].mode()
df["CouncilArea"] = df["CouncilArea"].fillna("Moreland")
print(df.isnull().sum())

X = df[["Rooms", "Type", "Distance", "Bedroom2", "Landsize", "BuildingArea", "Regionname"]]
y = df["Price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)

fun = FunctionTransformer(np.log1p, validate=True)
cols = ["Rooms", "Distance", "Bedroom2", "Landsize", "BuildingArea"]
X_train_trans = fun.fit_transform(X_train[cols])

X_train_trans  = pd.DataFrame(
    X_train_trans ,
    columns=cols,
    index = X_train.index
)



cols = ["Rooms", "Distance", "Bedroom2", "Landsize", "BuildingArea"]
fig, axes = plt.subplots(5, 2, figsize=(10,10))
for i, col in enumerate(cols):
    
    
    sns.histplot(X_train[col], kde=True, ax=axes[i, 0])
    axes[i, 0].set_title(f"Before Transformation : {col}")
    

    sns.histplot(X_train_trans[col], kde=True, ax=axes[i, 1])
    axes[i, 1].set_title(f"After: Transformation {col}")

plt.tight_layout()
plt.show()


print(X_train_trans.head())


# func_1 = FunctionTransformer(func = np.log1p)
# func_2 = FunctionTransformer(lambda x : x**2)

num_feature = ["Rooms", "Distance", "Bedroom2", "Landsize", "BuildingArea"]
cat_feature = ["Type", "Regionname"]

num_pipeline = Pipeline([
    ("log", FunctionTransformer(np.log1p, validate=True)),
    ("scaler", StandardScaler())
])


trans1 = ColumnTransformer([("num", num_pipeline, num_feature),
                             ("cat", OneHotEncoder(handle_unknown="ignore"), cat_feature)])

pipeline1 = Pipeline([("preprocessing", trans1),
                      ("model", LinearRegression())])

pipeline2 = Pipeline([("preprocessing", trans1),
                      ("model", DecisionTreeRegressor(criterion="squared_error",   
                                                        max_depth=10,              
                                                        min_samples_split=2,
                                                        min_samples_leaf=1,
                                                        random_state=42))])                      

pipeline3 = Pipeline([("preprocessing", trans1),
                      ("model",RandomForestRegressor(n_estimators=100,      
                                                        max_depth=15,        
                                                        min_samples_split=2,
                                                        min_samples_leaf=1,
                                                        max_features="sqrt",  
                                                        random_state=42,
                                                        n_jobs=-1 ))])

pipeline4 = Pipeline([("preprocessing", trans1),
                      ("model", SGDRegressor(max_iter=2000,
        eta0=0.01,
        random_state=42))])


# Linear Regression
pipeline1.fit(X_train, y_train)
y_pred = pipeline1.predict(X_test)


# Decision Tree Regressor
pipeline2.fit(X_train, y_train)
y_pred1 = pipeline2.predict(X_test)



# Random Forest Regressor
pipeline3.fit(X_train, y_train)
y_pred2 = pipeline3.predict(X_test)

# SGD Regressor
pipeline4.fit(X_train, y_train)
y_pred3 = pipeline4.predict(X_test)

cv_scores1 = cross_val_score(
    pipeline2,
    X,
    y,
    cv=5,
    scoring="r2"
)


cv_scores2 = cross_val_score(
    pipeline3,
    X,
    y,
    cv=5,
    scoring="r2"
)





cv_scores3 = cross_val_score(
    pipeline4,
    X,
    y,
    cv=5,
    scoring="r2"
)

data = {"Models": ["Linear Regression", "Decision Tree Regressor", "Random Forest Regressor", "SGD Regressor"],
        "MAE":[mean_absolute_error(y_test, y_pred),
               mean_absolute_error(y_test, y_pred1),
               mean_absolute_error(y_test, y_pred2),
               mean_absolute_error(y_test, y_pred3)],
        "MSE":[mean_squared_error(y_test, y_pred),
              mean_squared_error(y_test, y_pred1),
              mean_squared_error(y_test, y_pred2),
              mean_squared_error(y_test, y_pred3)],
        "R2 Score":[r2_score(y_test, y_pred),
                   r2_score(y_test, y_pred1),
                   r2_score(y_test, y_pred2),
                   r2_score(y_test, y_pred3)],
        "Cross Val Score":[None, cv_scores1, cv_scores2, cv_scores3],            
                                }

df_metrics = pd.DataFrame(data)

print(df_metrics.head())


sns.barplot(data = df_metrics, x = "Models", y = "R2 Score", palette="viridis",
    edgecolor="black")
plt.title("Model Comparison Based on R² Score", fontsize=14, fontweight="bold")    
plt.show()