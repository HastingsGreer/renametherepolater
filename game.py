import math

class Game(object):
    def __init__(self, init_map):
        self._map = init_map

    def execute(self, order66):
        unit_locs = {}
        unit_moves = {}

        for i, row in enumerate(self._map):
            for j, cell in enumerate(row):
                if len(cell['unit']) == 0:
                    pass
                unit_locs[cell['unit']['id']] = [i, j]


        for i, move in enumerate(order66['moves']):
            dx = move['end'][0] - move['start'][0]
            steps = math.abs(dx)
            dx = dx / math.abs(dx)

            dy = move['end'][1] - move['start'][1]
            dy = dy / math.abs(dy)

            order66['moves'][i]['dx'] = dx
            order66['moves'][i]['dy'] = dy
            order66['moves'][i]['steps'] = steps

        f

