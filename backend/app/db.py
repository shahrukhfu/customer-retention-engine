from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from .config import settings
import logging

logger = logging.getLogger(__name__)

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.data = []

    async def find_one(self, filter_query, sort=None):
        # Sort is used for metrics: sort=[("timestamp", -1)]
        dataset = self.data
        if sort:
            # We sort by timestamp descending if sort is specified
            dataset = sorted(self.data, key=lambda x: x.get("timestamp", ""), reverse=True)
            
        for doc in dataset:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    async def insert_one(self, doc):
        doc_copy = doc.copy()
        if "_id" not in doc_copy:
            doc_copy["_id"] = ObjectId()
        self.data.append(doc_copy)
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc_copy["_id"])

    async def delete_many(self, filter_query):
        # Simplified clear
        self.data = []
        return None

class MockDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name)
        return self.collections[name]

class Database:
    client: AsyncIOMotorClient = None
    db = None
    use_mock: bool = False

db_helper = Database()

def get_db():
    if db_helper.db is None:
        raise RuntimeError("Database connection not initialized")
    return db_helper.db

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    try:
        db_helper.client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)
        db_helper.db = db_helper.client[settings.DATABASE_NAME]
        # Force a connection check by pinging database
        await db_helper.client.admin.command('ping')
        logger.info("Connected to MongoDB successfully.")
        db_helper.use_mock = False
    except Exception as e:
        logger.warning(f"Failed to connect to MongoDB: {e}")
        logger.warning(">>> FALLBACK: Initializing In-Memory Mock Database for development.")
        db_helper.db = MockDatabase()
        db_helper.use_mock = True

async def close_mongo_connection():
    if db_helper.client and not db_helper.use_mock:
        db_helper.client.close()
        logger.info("MongoDB connection closed.")
