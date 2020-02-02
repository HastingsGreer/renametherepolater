import json

def generate_initial_map(player1_units, player2_units, selMap):
    rows = selMap['map']

    initMap = {
        "map" : {
            "board":[[
                {
                "background": bg,
                "unit": {}
                } for bg in row['row']] for row in rows],

            "animations": {
                "moves": [
                ],
                "attacks": [
                ]
            }
        }
    }

    y = len(rows)
    # May need to edit this if we're allowing jagged maps (which we shouldn't)
    x = len(rows[0]['row'])

    count = 1
    for unit in player1_units:
        initMap["map"]["board"][0][(x // 2) + (-1 if (count % 2) == 1 else 1) * (count // 2)]["unit"] = unit
        count += 1
    count = 1
    for unit in player2_units:
        initMap["map"]["board"][y-1][(x // 2) + (-1 if (count % 2) == 1 else 1) * (count // 2)]["unit"] = unit
        count += 1

    return initMap
