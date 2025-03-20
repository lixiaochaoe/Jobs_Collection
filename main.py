from typing import Optional, Dict, List
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel

# Create FastAPI application instance
app = FastAPI(title="Item API", description="API for managing items")

# Define the Item model using Pydantic
class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    is_active: bool

# Define ItemUpdate model for partial updates
class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None

# In-memory database as a dictionary
items_db: Dict[int, Item] = {}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Item API! Use /docs to view the API documentation."}

# GET endpoint to retrieve all items
@app.get("/items", response_model=List[Item])
async def read_items():
    return list(items_db.values())

# GET endpoint to retrieve a specific item by ID
@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return items_db[item_id]

# GET endpoint to search items with filters
@app.get("/items/search", response_model=List[Item])
async def search_items(
    name: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_active: Optional[bool] = None
):
    filtered_items = list(items_db.values())
    
    if name:
        filtered_items = [item for item in filtered_items if name.lower() in item.name.lower()]
    
    if min_price is not None:
        filtered_items = [item for item in filtered_items if item.price >= min_price]
    
    if max_price is not None:
        filtered_items = [item for item in filtered_items if item.price <= max_price]
    
    if is_active is not None:
        filtered_items = [item for item in filtered_items if item.is_active == is_active]
    
    return filtered_items

# POST endpoint to create a new item
@app.post("/items", response_model=Item, status_code=201)
async def create_item(item: Item):
    if item.id in items_db:
        raise HTTPException(status_code=400, detail="Item with this ID already exists")
    items_db[item.id] = item
    return item

# PUT endpoint to update an existing item
@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: Item):
    if item_id != item.id:
        raise HTTPException(status_code=400, detail="Path ID does not match item ID")
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    items_db[item_id] = item
    return item

# PATCH endpoint to partially update an item
@app.patch("/items/{item_id}", response_model=Item)
async def patch_item(item_id: int, item_update: ItemUpdate):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    ###########
    # Get the existing item
    stored_item = items_db[item_id]
    stored_item_data = stored_item.dict()
    
    # Create update data excluding unset fields
    update_data = {k: v for k, v in item_update.dict().items() if v is not None}
    
    # Update the stored item with the new values
    updated_item_data = {**stored_item_data, **update_data}
    updated_item = Item(**updated_item_data)
    
    # Save the updated item
    items_db[item_id] = updated_item
    return updated_item

# DELETE endpoint to delete an item
@app.delete("/items/{item_id}", status_code=204)
async def delete_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del items_db[item_id]
    return None

# Run the server using Uvicorn when the script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)