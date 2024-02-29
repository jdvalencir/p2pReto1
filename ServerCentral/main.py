from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List 
import uuid
import json

app = FastAPI()

class idRequest(BaseModel):
    id: str

class PServer(BaseModel):
    ip_address: str
    file_index: List[str]

class UpdateFileIndexRequest(BaseModel):
    id: str
    file_index: List[str]

class SearchFileRequest(BaseModel):
    file_name: str
    unique_id: str

# Base de datos
pservers = {
  "e49f7a54-a8bb-47ca-8f49-6c169f4ff854": {
    "ip_address": "192.12.32.45",
    "file_index": [
      "edison.mp3", "433.mp3", "123.png", "hola.txt"
    ]
  },
  "405a0a35-f7f5-4921-ab88-7f7ddb217a50": {
    "ip_address": "192.12.32.46",
    "file_index": [
      "edison.mp3", "433.mp3", "123.png", "hola.txt"
    ]
  },
  "83db576d-642f-48d2-9e5a-26f93a8602b1": {
    "ip_address": "192.12.32.47",
    "file_index": [
      "fsdfssdf.mp3", "hola.mp3", "chico.png", "hola.txt"
    ]
  },
  "1ed4493a-3652-418c-a1bc-45ff10323546": {
    "ip_address": "192.12.32.48",
    "file_index": [
      "edison.mp3", "fsdfsdf.mp3", "chico.png", "gdfgg.txt"
    ]
  }
}

# Ruta para que un PServer haga login
@app.post("/api/v1/login")
async def login(pserver: PServer):
  unique_id = str(uuid.uuid4())
  pservers[unique_id] = {"ip_address": pserver.ip_address, "file_index": pserver.file_index}
  json_formatted_str = json.dumps(pservers, indent=2)
  print(json_formatted_str)
  return {"Message": "PServer registrado exitosamente", "id": unique_id}


# Ruta para que un PServer haga logut
@app.post("/api/v1/logout")
async def logout(request: idRequest):
  if request.id not in pservers:
      raise HTTPException(status_code=400, detail="PServer no encontrado")
  del pservers[request.id]
  return {"Message": "Pserver retirado exitosamente"}


# Ruta para listar todos los PServer que tienen un archivo
@app.post("/api/v1/peer_list")
async def searchFileInPeer(request: SearchFileRequest):
  matches = []
  for pserver_id, data in pservers.items(): 
      if(request.file_name in data["file_index"] and pserver_id != request.unique_id):
            matches.append(data["ip_address"])
  if not matches: 
      return { "Message": "No se encontraron peers con este archivo" } # Hacer Exception
  return {"Message": "Se han encontrado peers con el archivo", "Matches": matches}

# Ruta para listar todos los PServer a los que se les puede subir un archivo
@app.post("/api/v1/upload_peer")
async def get_upload_peer(requester_id: idRequest):
  print(pservers.items())
  available_ips = [pserver["ip_address"] for id, pserver in pservers.items() if id != requester_id.id]
  if not available_ips:
      return {"Message": "No hay más peers disponibles para subir el archivo"} # HACER Exception
  return {"Message": "Hay peers disponibles para subir el archivo", "Available_Peers_IPs": available_ips}


@app.post("/api/v1/update_file_index")
async def update_file_index(request: UpdateFileIndexRequest):
  # Implementar lógica para devolver el estado del pserver solicitado
  return 

"""
    SERVIDOR CENTRAL
    ----------------
    1. Manejar la localización
     - El Pclient quiere descargar un archivo, se lo dice al pserver por medio de API REST
     - El Pserver al enterarse de esto, le dice al Server central que le envíe todos los Pserver que tienen ese archivo, 
       Estos 2 se comunican por medio de API REST
     - El server central al enterarse de eso, busca en el JSON de indices, el archivo que se necesita.
     - Entonces, mete en una lista todos los Pserver que tienen el archivo y se los envía al Pserver que esta buscando. 
     - Cuando el Pserver tiene esta lista, puede escoger cual es el mejor o enviarselo al cliente para que escoja
     - Cuando escoge 
"""
