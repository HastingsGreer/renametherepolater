import json

def generate_initial_map(x, y, player1_units, player2_units):
    initMap = {
        "map" : {
            "board":[[
                {
                "background":"dirt",
                "unit": {}
                } for i in range(x)] for j in range(y)],

            "animations": {
                "moves": [
                ],
                "attacks": [
                ]
            }
        }
    }

    count = 1
    for unit in player1_units:
        initMap["map"]["board"][(y // 2) + (-1 if (count % 2) == 0 else 1) * (count // 2)][0]["unit"] = unit
        count += 1
    count = 1
    for unit in player2_units:
        initMap["map"]["board"][(y // 2) + (-1 if (count % 2) == 0 else 1) * (count // 2)][x-1]["unit"] = unit
        count += 1
    return initMap
