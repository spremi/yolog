#
# yo!log
#

import asyncio
import logging

from fastapi import APIRouter,  WebSocket, WebSocketDisconnect
from fastapi.encoders import jsonable_encoder

from state import log_queue, log_queue_lock, connected_clients

router = APIRouter()

logger = logging.getLogger(__name__)


@router.websocket('/view/ws')
async def websocket_log_viewer(websocket: WebSocket):
    await websocket.accept()

    logger.info(f'Client connected: {websocket.client.host}: {websocket.client.port}')

    client_info = {
        'ws': websocket,
        'host': websocket.client.host,
        'port': websocket.client.port
    }

    connected_clients.append(client_info)

    try:
        while True:
            async with log_queue_lock:
                if log_queue:
                    # Queue has logs
                    while log_queue:
                        # Broadcast them
                        log_entry = log_queue.popleft()  # remove oldest log

                        await broadcast_log(log_entry)

                    # Immediately check for more logs
                    continue

            # If no logs, sleep briefly to avoid busy loop
            await asyncio.sleep(0.1)

    except WebSocketDisconnect:
        logger.info(f'Client disconnected: {client_info["host"]}')
        pass

    finally:
        if client_info in connected_clients:
            connected_clients.remove(client_info)


async def broadcast_log(log_entry: dict):
    disconnected = []

    for client in connected_clients:
        try:
            await client['ws'].send_json(jsonable_encoder(log_entry))

        except (RuntimeError, WebSocketDisconnect):
            logger.info(f'Client disconnected: {client["host"]}')
            disconnected.append(client)

        except Exception as e:
            print(f'Unexpected error sending log to {client["host"]}: {e}')
            disconnected.append(client)

    for client in disconnected:
        if client in connected_clients:
            connected_clients.remove(client)
