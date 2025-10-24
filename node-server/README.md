# server 2025

> [!NOTE]
> change **<http://localhost:5000/>** to your **process.env.PORT**

## users resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/users/signup](http://localhost:5000/users/signup)| POST | user sign up | - |-|-|{username,email,password,addres}|-|user+token|204|
| [http://localhost:5000/users/signin](http://localhost:5000/users/signin) | POST | user sign in | - |-|-|{email,password}|-|user+token|204|
| [http://localhost:5000/users/getAllUser](http://localhost:5000/getAllUser)| GET | get all user  | current user |-|-||-|all usesr|200|

## recipes resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/recipes/getallrecipes](http://localhost:5000/recipes/getallrecipes) | GET | get all recipes | - |-|seach value ,start page ,num of page|-|-|all recipes|200|
| [http://localhost:5000/recipes/getRecipeByCode/:id](http://localhost:5000/recipes/getRecipeByCode/:id) | GET |  get recipe by id  | - |*id*|-|-|-|recipe by *id*|200|
| [http://localhost:5000/recipes/getRecipesByPreparationTime/:pt](http://localhost:5000/recipes/getRecipesByPreparationTime:/pt) | GET | get recipes by *preaperation time* | - |*preapertain time*|-|-|-|recipe by preapertain time|200|
| [http://localhost:5000/recipes/getRecipesByUser/:id](http://localhost:5000/recipes/getRecipesByUser/:id) | GET |  return recipe by *user  id* | curren user | user id|-|-|token|recipe by *use id*|200|
| [http://localhost:5000/recipes/addRecipe](http://localhost:5000/recipes/addRecipe) | POST | add recipe  |curren user|-|-|{recipe}|token|new recipe added|204|
| [http://localhost:5000/updateRecipes/:id](http://localhost:5000/updateRecipes/:id) | UPDATE |   update existing reipe  (by *recipe id*) | curren user |*recipe id*|-|{new recipe}|token|return  updated recipe|204|
 [http://localhost:5000/deleteRecipe/:id](http://localhost:5000/deleteRecipe/:id) | DELETE |   deleting existing reipe  (by *recipe id*) | curren user |*recipe id*|-|-|token|-|204|


## category resource
| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/categories/getallcategories](http://localhost:5000/categories/getallcategories) | GET | get all category | - |-|-|-|-|all category|200|
| [http://localhost:5000/categories/getAllCategoriesAndRecipe](http://localhost:5000/categories/getAllCategoriesAndRecipe) | GET | get all category with recipe| - |-|-|-|-|all category with recipe |200|
| [http://localhost:5000/categories/getCategoryByIdWithRec/:id](http://localhost:5000/categories/getCategoryByIdWithRec/:id) | GET | get category by id with recipe| - |*id*|-|-|-|category by id with recipes |200|