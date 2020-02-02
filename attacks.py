import random

def get_unit_by_id(game, id):
    for row in game._map:
        for cell in row:
            unit = cell['unit']
            if (len(unit) != 0):
                if(unit['id'] == id):
                    return unit
    print("attempted to get a unit that doesn't exist. Error inbound")

def get_position_by_id(game, id):
    for i, row in enumerate(game._map):
        for j, cell in enumerate(row):
            unit = cell['unit']
            if (len(unit) != 0):
                if(unit['id'] == id):
                    return i, j
    print("attempted to get a unit that doesn't exist. Error inbound")


def check_range_legal(x, y, game, id):

    unit_i, unit_j = get_position_by_id(game, id)
    unit = get_unit_by_id(game, id)

    return max(abs(x - unit_i), abs(y - unit_j)) <= unit["attack_range"]


def apply_help(x, y, game, help):
    if len(game._map[x][y]['unit']) != 0:
        game._map[x][y]['unit']['happiness'] += help

    if game._map[x][y]['background'] == 'dirt':
        game._map[x][y]['background'] = 'grass'


def rocket_attack(x, y, game, id):
    rocket_damage = 10
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            xhat = x + dx
            yhat = y + dy
            if xhat < 0 or xhat >= len(game._map):
                continue
            if yhat < 0 or yhat >= len(game._map[0]):
                continue
            if len(game._map[xhat][yhat]['unit']) != 0:
                game._map[xhat][yhat]['unit']['happiness'] += \
                    int(random.normalvariate(rocket_damage, rocket_damage / 5))
            if game._map[xhat][yhat]['background'] == 'dirt':
                game._map[xhat][yhat]['background'] = 'grass'
    game._map[x][y]["background"] = 'tree'

def bench_attack(x, y, game, id):
    
    if not(check_range_legal(x, y, game, id)):
        print("can't yeech a bench")
        return

    unit = get_unit_by_id(game, id)

    if unit['has_bench'] == 0:
        print("illegal bench attempted")
        return
    unit['has_bench'] = 0

    game._map[x][y]["background"] = 'bench'
    

def therapist_attack(x, y, game, id):
    if not(check_range_legal(x, y, game, id)):
        print("can't yeech a bench")
        return
    apply_help(x, y, game, 100)

def normie_attack(x, y, game, id):
    if not(check_range_legal(x, y, game, id)):
        print("can't yeech a bench")
        return
    apply_help(x, y, game, 30)

ATTACK_LOOKUP = {
    'tree_rocket': rocket_attack,
    'place_bench': bench_attack,
    'encourage' : normie_attack,
    'discuss_problems': therapist_attack
}

def flower_dmg(x, y, game):
    unit = game._map[x][y]['unit']
    if len(unit) != 0:
        if unit['type'] != 'flower_girl':
            unit['happiness'] += 15

def bench_dmg(x, y, game):
    unit = game._map[x][y]['unit']
    if len(unit) != 0:
        if unit['type'] != 'bench_boi':
            unit['sitting_on_bench'] = "yes"
            unit['owner'] = -1

ENVIRONMENT_LOOKUP = {
    'tree' : (lambda x, y, game: None),
    'grass' : (lambda x, y, game: None),
    'flowers': flower_dmg,
    "bench": bench_dmg,
    "water": (lambda x, y, game: None),
    "dirt": (lambda x, y, game: None)
}

id_counter = 0
def make_unit(type, owner):
    units = {
       "treebuchet" 	: {"id": -1, 	"type": "treebuchet", 	"happiness":3, "owner":-1, "attack": "tree_rocket", 					"attack_range": 100},
       "flower_girl" 	: {"id": -1, 	"type": "flower_girl", 	"happiness":3, "owner":-1, 												"attack_range": -1},
       "bench_boi" 		: {"id": -1, 	"type": "bench_boi", 	"happiness":3, "owner":-1, "attack": "place_bench", "has_bench": 1, 	"attack_range":1},
       "therapist" 		: {"id": -1, 	"type": "therapist", 	"happiness":3, "owner":-1, "attack": "discuss_problems", 				"attack_range":1},
       "normie" 		: {"id": -1, 	"type": "normie", 		"happiness":3, "owner":-1, "attack": "encourage", 						"attack_range":1},
       "doggo" 			: {"id": -1, 	"type": "doggo", 	    "happiness":3, "owner":-1, 												"attack_range": -1},
       "austin" 		: {"id": -1, 	"type": "austin", 	    "happiness":3, "owner":-1, 												"attack_range": -1},
       "cat" 			: {"id": -1, 	"type": "cat", 	        "happiness":3, "owner":-1, 												"attack_range": -1},
       "cynthia" 		: {"id": -1, 	"type": "cynthia", 	    "happiness":3, "owner":-1, 												"attack_range": -1},
       "lumberjack" 	: {"id": -1, 	"type": "lumberjack", 	"happiness":3, "owner":-1, 												"attack_range": -1},
       "pirate" 		: {"id": -1, 	"type": "pirate", 	    "happiness":3, "owner":-1, 												"attack_range": -1}
    }

    res = units[type]
    global id_counter
    res['id'] = id_counter
    id_counter += 1
    res["owner"] = owner
    return res

    
