#
# yo!log
#

import asyncio

from collections import deque

MAX_QUEUE_SIZE = 1000

#
# Queue used to communicate between OTLP receiver and websocket provider.
# deque automatically removes old logs from the queue logs are appended
# beyond maxlen.
#
log_queue = deque(maxlen=MAX_QUEUE_SIZE)

#
# Lock to safely modify deque.
#
log_queue_lock = asyncio.Lock()

#
# List of currently connected WebSocket clients.
#
connected_clients = []
