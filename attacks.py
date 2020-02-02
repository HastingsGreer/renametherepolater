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
            game._map[xhat][yhat]['environment']['background'] = 'grass'

def bench_attack(x, y, game):
    game._map[x][y]['enhancements'].append('bench')

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
    'flowers': flower_dmg,
    "bench": bench_dmg,
    "dirt": (lambda x, y, game: None)
}
