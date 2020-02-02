import random

def rocket_attack(x, y, game):
    rocket_damage = 10
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            xhat = x + dx
            yhat = y + dy
            if xhat < 0 or xhat >= len(game._map):
                continue
            if yhat < 0 or yhat >= len(game._map):
                continue
            if len(game._map[xhat][yhat]['unit']) != 0:
                game._map[xhat][yhat]['unit']['happiness'] += \
                    int(random.normalvariate(rocket_damage, rocket_damage / 5))
            game._map[xhat][yhat]['background'] = 'grass'
    game._map[x][y]["background"] = 'tree'

def bench_attack(x, y, game):
    game._map[x][y]["background"] = 'bench'

ATTACK_LOOKUP = {
    'tree_rocket': rocket_attack,
    'bench_attack': bench_attack
}

def flower_dmg(x, y, game):
    unit = game._map[x][y]['unit']
    if len(unit) != 0:
        if unit['type'] != 'flower_girl':
            unit['happiness'] += 5

def bench_dmg(x, y, game):
    unit = game._map[x][y]['unit']
    if len(unit) != 0:
        if unit['type'] != 'bench_boi':
            unit['happiness'] += 100

ENVIRONMENT_LOOKUP = {
    'tree' : (lambda x, y, game: None),
    'grass' : (lambda x, y, game: None),
    'flowers': flower_dmg,
    "bench": bench_dmg,
    "dirt": (lambda x, y, game: None)
}



id_counter = 0
def make_unit(type, owner):
    units = {
       "treebuchet" : {"id": -1, "type": "treebuchet", "happiness":3, "owner":-1, "attack": "tree_rocket"},
       "flower_girl" : {"id": -1, "type": "flower_girl", "happiness":3, "owner":-1},
       "bench_boi" : {"id": -1, "type": "bench_boi", "happiness":3, "owner":-1, "attack": "place_bench"},
       "therapist" : {"id": -1, "type": "therapist", "happiness":3, "owner":-1, "attack": "discuss_problems"},
       "normie" : {"id": -1, "type": "normie", "happiness":3, "owner":-1, "attack": "encourage"}
    }

    res = units[type]
    global id_counter
    res['id'] = id_counter
    id_counter += 1
    res["owner"] = owner
    return res

    
