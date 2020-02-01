import json

def example_json():
    example_json = {
            "board":[[
                {
                "environment": 
                    {"background":"grass", "improvements":[]},
                "unit": { "type" : "placeholder"}
                } for i in range(5)] for j in range(5)],
            "animations": [
                {
                   "type": "tree_rocket",
                   "start": [1, 3],
                   "end": [4, 2]
                },
            ]
    }

    example_json["board"][1][3]["unit"] = {"id": 0, "type": "treebuchet",
            "happiness":3, "owner":0}
    example_json["board"][3][3]["unit"] = {"id": 1, "type": "flower_girl",
            "happiness":3, "owner":1}
    example_json["board"][4][4]["environment"]["improvements"].append("flowers")

    return example_json

def example_client_reply():
    return {
        'moves': [
            { 'id': 0, "start": [1, 3], "end": [1, 4] },
            { 'id': 1, "start": [4, 4], "end": [2, 2] }
        ],
        'attacks': [
            { 'id': 0, 'target': [1, 2], 'type': 'tree_rocket' }
        ]
    }

if __name__ == '__main__':
    print(json.dumps(example_json()))

