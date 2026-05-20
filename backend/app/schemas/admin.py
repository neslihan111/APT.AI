from pydantic import BaseModel


class AdminTransferRequest(BaseModel):
    new_admin_id: int
