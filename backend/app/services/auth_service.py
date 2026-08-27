import uuid
from datetime import datetime
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services.store import store

class AuthService:
    @staticmethod
    def register(user_in: UserCreate) -> UserResponse:
        user_id = f"usr-{str(uuid.uuid4())[:8]}"
        user_dict = user_in.model_dump()
        user_dict.pop("password", None)
        user_dict["id"] = user_id
        user_dict["created_at"] = datetime.utcnow()
        store.users[user_id] = user_dict
        return UserResponse(**user_dict)

    @staticmethod
    def login(login_in: UserLogin) -> TokenResponse:
        # Match user by email
        for user in store.users.values():
            if user["email"].lower() == login_in.email.lower():
                token = f"pashuraksha_demo_jwt_{user['id']}"
                return TokenResponse(
                    access_token=token,
                    user=UserResponse(**user)
                )
        # If not found, return demo user for smooth SIH testing
        demo_user = list(store.users.values())[0]
        return TokenResponse(
            access_token="pashuraksha_demo_jwt_default",
            user=UserResponse(**demo_user)
        )

    @staticmethod
    def get_user_by_id(user_id: str):
        return store.users.get(user_id)
