import json

import attacks

def example_json():
    example_json = {
            "board":[[
                {
                "background":"dirt",
                "unit": {}
                } for i in range(5)] for j in range(7)],

            "animations": {
                "moves": [
                   { "id": 0, 'start': [0, 3], "end": [1, 3]},
                   { "id": 1, "start": [4, 4], "end": [3, 3]}
                ],
                "attacks": [
                   {
                        "type": "tree_rocket",
                        "start": [1, 3],
                        "end": [4, 2]
                    },
                ]
            }
    }

    example_json["board"][1][3]["unit"] = attacks.make_unit("treebuchet", 0)
    example_json["board"][3][3]["unit"] = attacks.make_unit("flower_girl", 1)
    example_json["board"][1][1]["unit"] = attacks.make_unit("bench_boi", 1)
    example_json["board"][6][2]["unit"] = attacks.make_unit("therapist", 0)
    example_json["board"][2][4]["unit"] = attacks.make_unit("normie", 1)
    example_json["board"][4][4]["background"] = "bench"

    return example_json

def example_client_reply():
    return {
        'moves': [
            { 'id': 0, "start": [1, 3], "end": [1, 4] },
            { 'id': 1, "start": [3, 3], "end": [2, 2] }
        ],
        'attacks': [
            { 'id': 0, 'target': [1, 2], 'type': 'tree_rocket' }
        ]
    }

if __name__ == '__main__':
    print(json.dumps(example_json()))

