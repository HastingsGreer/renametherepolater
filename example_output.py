example_json = {
        "board":[[
            {
            "environment": 
                {"background":"grass", "improvements":[]},
            "unit": 0
            } for i in range(5)] for j in range(5)],
        "animations": [
            {
               "type": "tree_rocket",
               "start": [1, 3],
               "end": [4, 2]
            },
        ]
}

example_json["board"][1][3]["unit"] = {"type": "treebuchet", "happiness":3, "owner":0}

example_json["board"][4][4]["environment"]["improvements"].append("flowers")

import json

print(json.dumps(example_json))


