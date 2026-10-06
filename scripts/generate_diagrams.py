import json
import random
import os

def create_element(type_name, id_name, x, y, width=None, height=None, **kwargs):
    el = {
        "type": type_name,
        "id": id_name,
        "x": x, "y": y,
        "version": 1,
        "versionNonce": random.randint(10000, 99999),
        "isDeleted": False,
        "groupIds": [],
        "boundElements": None,
        "link": None,
        "locked": False,
        "seed": random.randint(10000, 99999),
        "opacity": 100,
        "roughness": 0,
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "fillStyle": "solid",
        "angle": 0
    }
    if width is not None: el["width"] = width
    if height is not None: el["height"] = height
    
    if type_name == "text":
        el.update({
            "fontSize": 16,
            "fontFamily": 3,
            "textAlign": "center",
            "verticalAlign": "middle",
            "baseline": 18,
            "strokeWidth": 1,
            "lineHeight": 1.25,
            "backgroundColor": "transparent"
        })
        el["originalText"] = kwargs.get("text", "")
    
    el.update(kwargs)
    return el

def generate_split_brain():
    elements = []
    
    # TITLES
    elements.append(create_element("text", "title_main", 400, 20, width=400, height=35, text="Arquitectura Split-Brain: Generador de Cartas", fontSize=28, textAlign="left", strokeColor="#1e40af"))
    
    # ZONES
    elements.append(create_element("rectangle", "zone_client", 50, 100, 300, 500, strokeColor="#1e3a5f", backgroundColor="#f8fafc", roundness={"type": 3}))
    elements.append(create_element("text", "title_client", 70, 120, width=200, height=25, text="1. Cliente (Local)", fontSize=20, textAlign="left", strokeColor="#1e40af"))
    
    elements.append(create_element("rectangle", "zone_server", 450, 100, 300, 500, strokeColor="#1e3a5f", backgroundColor="#f0f9ff", roundness={"type": 3}))
    elements.append(create_element("text", "title_server", 470, 120, width=200, height=25, text="2. Servidor (Next.js)", fontSize=20, textAlign="left", strokeColor="#1e40af"))
    
    elements.append(create_element("rectangle", "zone_cloud", 850, 100, 300, 500, strokeColor="#6d28d9", backgroundColor="#faf5ff", roundness={"type": 3}))
    elements.append(create_element("text", "title_cloud", 870, 120, width=200, height=25, text="3. Nube (APIs Externas)", fontSize=20, textAlign="left", strokeColor="#6d28d9"))
    
    # CLIENT COMPONENTS
    elements.append(create_element("rectangle", "box_input", 80, 180, 240, 60, strokeColor="#c2410c", backgroundColor="#fed7aa", roundness={"type": 3}))
    elements.append(create_element("text", "text_input", 200, 200, 200, 20, text="Entrada del Usuario\n(LinkedIn / Glassdoor)", strokeColor="#c2410c"))
    
    elements.append(create_element("rectangle", "box_regex", 80, 280, 240, 60, strokeColor="#1e3a5f", backgroundColor="#93c5fd", roundness={"type": 3}))
    elements.append(create_element("text", "text_regex", 200, 300, 200, 20, text="Extracción Regex Salarial\n(Sin llamadas externas)", strokeColor="#1e3a5f"))
    
    elements.append(create_element("rectangle", "box_sanitize", 80, 380, 240, 60, strokeColor="#dc2626", backgroundColor="#fee2e2", roundness={"type": 3}))
    elements.append(create_element("text", "text_sanitize", 200, 400, 200, 20, text="Anonimización de PII\n(Eliminar Nombres/Salarios)", strokeColor="#dc2626"))
    
    elements.append(create_element("rectangle", "box_restore", 80, 500, 240, 60, strokeColor="#047857", backgroundColor="#a7f3d0", roundness={"type": 3}))
    elements.append(create_element("text", "text_restore", 200, 520, 200, 20, text="Restaurar PII\n(Mostrar Carta Final)", strokeColor="#047857"))
    
    # SERVER COMPONENTS
    elements.append(create_element("rectangle", "box_proxy", 480, 280, 240, 60, strokeColor="#1e3a5f", backgroundColor="#60a5fa", roundness={"type": 3}))
    elements.append(create_element("text", "text_proxy", 600, 300, 200, 20, text="Route Handlers\n(Proxy API Seguro)", strokeColor="#1e3a5f"))
    
    elements.append(create_element("rectangle", "box_keys", 480, 380, 240, 60, strokeColor="#b45309", backgroundColor="#fef3c7", roundness={"type": 3}))
    elements.append(create_element("text", "text_keys", 600, 400, 200, 20, text="Inyección de API Keys\n(Ocultas del Cliente)", strokeColor="#b45309"))

    # ARTIFACT
    elements.append(create_element("rectangle", "artifact_payload", 480, 480, 240, 80, strokeColor="#22c55e", backgroundColor="#1e293b", roundness={"type": 3}))
    elements.append(create_element("text", "text_artifact", 490, 490, 220, 60, text='{\n  "job": "Software Engineer",\n  "name": "[REDACTED]"\n}', strokeColor="#22c55e", textAlign="left"))

    # CLOUD COMPONENTS
    elements.append(create_element("rectangle", "box_proxycurl", 880, 180, 240, 60, strokeColor="#6d28d9", backgroundColor="#ddd6fe", roundness={"type": 3}))
    elements.append(create_element("text", "text_proxycurl", 1000, 200, 200, 20, text="Proxycurl / Serper APIs\n(Datos Externos)", strokeColor="#6d28d9"))
    
    elements.append(create_element("rectangle", "box_gemini", 880, 280, 240, 160, strokeColor="#6d28d9", backgroundColor="#ddd6fe", roundness={"type": 3}))
    elements.append(create_element("text", "text_gemini", 1000, 350, 200, 20, text="Google Gemini Pro\n(Generación de Carta)", strokeColor="#6d28d9"))
    
    # CONNECTIONS
    def connect(id1, x, y, w, h, col="#1e3a5f"):
        return create_element("arrow", id1, x, y, w, h, strokeColor=col, points=[[0,0], [w, h]], endArrowhead="arrow", strokeWidth=2)
    
    elements.append(connect("a1", 200, 240, 0, 40)) # Input -> Regex
    elements.append(connect("a2", 200, 340, 0, 40)) # Regex -> Sanitize
    elements.append(connect("a3", 320, 410, 160, -100)) # Sanitize -> Proxy
    elements.append(connect("a4", 600, 340, 0, 40)) # Proxy -> Keys
    elements.append(connect("a5", 720, 310, 160, 0, col="#6d28d9")) # Proxy -> Gemini
    elements.append(connect("a6", 720, 210, 160, 0, col="#6d28d9")) # Proxy -> Proxycurl
    elements.append(connect("a7", 880, 350, -160, 0, col="#6d28d9")) # Gemini -> Proxy (Return)
    elements.append(connect("a8", 480, 310, -160, 200)) # Proxy -> Restore (Return)

    return {
        "type": "excalidraw",
        "version": 2,
        "source": "https://excalidraw.com",
        "elements": elements,
        "appState": {"viewBackgroundColor": "#ffffff", "gridSize": 20},
        "files": {}
    }

def generate_pipeline():
    elements = []
    
    elements.append(create_element("text", "title_main", 100, 50, width=400, height=35, text="Flujo de Datos y Eventos", fontSize=28, textAlign="left", strokeColor="#1e40af"))
    
    # Timeline
    elements.append(create_element("line", "timeline", 250, 150, 0, 500, strokeColor="#64748b", points=[[0,0], [0,500]], strokeWidth=2))
    
    steps = [
        (150, "Usuario introduce LinkedIn/Glassdoor URL", "#c2410c", "#fed7aa"),
        (250, "Cerebro Local (Navegador) raspa salarios", "#1e3a5f", "#93c5fd"),
        (350, "Cerebro Local elimina nombre y PII", "#dc2626", "#fee2e2"),
        (450, "Servidor Next.js añade API Keys", "#b45309", "#fef3c7"),
        (550, "API Gemini procesa la plantilla segura", "#6d28d9", "#ddd6fe"),
        (650, "Cerebro Local recibe y restaura nombre", "#047857", "#a7f3d0"),
    ]
    
    for i, (y, txt, sc, bg) in enumerate(steps):
        elements.append(create_element("ellipse", f"dot_{i}", 244, y-6, 12, 12, strokeColor=sc, backgroundColor=bg))
        elements.append(create_element("text", f"lbl_{i}", 280, y-15, 300, 20, text=txt, fontSize=18, textAlign="left", strokeColor=sc))
        
        # Add Evidence artifacts for specific steps
        if i == 2:
            elements.append(create_element("rectangle", f"art_bg_{i}", 650, y-20, 300, 60, strokeColor="#1e3a5f", backgroundColor="#1e293b", roundness={"type": 3}))
            elements.append(create_element("text", f"art_txt_{i}", 660, y-10, 280, 40, text='const safePayload = { ...payload };\ndelete safePayload.name;', fontSize=14, textAlign="left", strokeColor="#60a5fa"))
        if i == 4:
            elements.append(create_element("rectangle", f"art_bg_{i}", 650, y-20, 300, 60, strokeColor="#6d28d9", backgroundColor="#1e293b", roundness={"type": 3}))
            elements.append(create_element("text", f"art_txt_{i}", 660, y-10, 280, 40, text='{\n "candidates": [{ "content": "Estimado..." }]\n}', fontSize=14, textAlign="left", strokeColor="#22c55e"))

    return {
        "type": "excalidraw",
        "version": 2,
        "source": "https://excalidraw.com",
        "elements": elements,
        "appState": {"viewBackgroundColor": "#ffffff", "gridSize": 20},
        "files": {}
    }

if __name__ == "__main__":
    os.makedirs("docs/diagrams", exist_ok=True)
    with open("docs/diagrams/split-brain.es.excalidraw", "w", encoding="utf-8") as f:
        json.dump(generate_split_brain(), f, indent=2)
    with open("docs/diagrams/pipeline.es.excalidraw", "w", encoding="utf-8") as f:
        json.dump(generate_pipeline(), f, indent=2)
    print("Files created.")
