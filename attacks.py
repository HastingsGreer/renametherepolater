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

ATTACK_LOOKUP = {
    'tree_rocket': rocket_attack
}

def flower_dmg(x, y, game):
    if len(game._map[x][y]['unit']) != 0:
        game._map[x][y]['unit']['happiness'] += 5

ENVIRONMENT_LOOKUP = {
    'flowers': flower_dmg
}
