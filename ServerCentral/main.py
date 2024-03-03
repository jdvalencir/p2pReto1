from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List 
import json
import time
import asyncio

app = FastAPI()

class PServer(BaseModel):
    ip_address: str
    file_index: List[str]

class IPAddress(BaseModel):
    ip_address: str

class FileIndexRequest(BaseModel):
    ip_address: str
    file_name: str

pservers = { 
   
}

current_index = 0
MAX_TIME_FOR_ACTIVE_PSERVER = 30

@app.post("/api/v1/pserver_login")
async def loginPserver(pserver: PServer): 
  server_identifier = pserver.ip_address
  server_host, server_port = pserver.ip_address.split(":")
  if server_identifier in pservers: 
      return HTTPException(status_code=400, detail="Pserver ya registrado")
  pservers[server_identifier] = {"ip": server_host, "port": server_port, "file_index": pserver.file_index }
  print(json.dumps(pservers))
  return {"Message": "PServer registrado exitosamente", "IP": server_identifier }


async def check_and_logout_inactive_pservers():
    while True:  
        current_time = time.time()
        inactive_pservers = [server_id for server_id, pserver_data in pservers.items()
                             if current_time - pserver_data['last_check_in'] > MAX_TIME_FOR_ACTIVE_PSERVER]
        for server_id in inactive_pservers:
            print(f"PServer {server_id} ha sido desconectado por inactividad.")
            del pservers[server_id]
        await asyncio.sleep(2) 

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(check_and_logout_inactive_pservers()) 

@app.post("/api/v1/upload_round_robin")
async def get_pserver_by_round_robin(requester: IPAddress):
    global current_index
    if len(pservers) < 2:
        raise HTTPException(status_code=404, detail="No hay suficientes pservers disponibles")
    original_index = current_index
    while True:
        keys = list(pservers.keys())
        server_id = keys[current_index]
        current_index = (current_index + 1) % len(pservers)
        if server_id != requester.ip_address:
            return server_id
        if current_index == original_index:
            raise HTTPException(status_code=404, detail="No hay otros pservers disponibles")

# Ruta para revisar los peers que se encuentran conectados
@app.post("/api/v1/check_peers_status")
async def check_peers_status(ip_address: IPAddress, background_tasks: BackgroundTasks):
  server_identifier = ip_address.ip_address
  if server_identifier in pservers:
    pservers[server_identifier]["last_check_in"] = time.time()
    print(f"PServer {server_identifier} hizo check-in.")
    return {"message": "Check-in recibido"}
  else:
    return {"message": "PServer no reconocido"}

@app.post("/api/v1/get_ip_list")
async def get_peers_by_file_name(request: FileIndexRequest):
  peers_with_file = []
  for ip_address, pserver in pservers.items():
      if request.file_name in pserver["file_index"] and request.ip_address != ip_address:
          peers_with_file.append(ip_address)
  if not peers_with_file:
      raise HTTPException(status_code=404, detail="Archivo no encontrado en ningún PServer")
  return peers_with_file

@app.post("/api/v1/update_list")
async def update_files_list(update_request: FileIndexRequest):
  server_identifier = update_request.ip_address
  if server_identifier not in pservers: 
      return HTTPException(status_code=400, detail="No se ha podido encontrar el pserver")
  pservers[server_identifier]["file_index"].append(update_request.file_name)
  return {"Updated File List": pservers[server_identifier]["file_index"]}