import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async


class NotificationsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.stream = self.scope["url_route"]['kwargs']['name']
        await self.channel_layer.group_add(f"{self.scope.user}", self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.close()

    async def receive_json(self, content, **kwargs):
        await self.send_json(content=content)

