import json

class Game(object):
    def __init__(self, init_map):
        self._map = init_map

    def execute(self, order66):
        unit_locs = {}
        unit_moves = {}
        # set of units that did not move in the last turn
        static_units = set([])
        unit_data = {}

        for i, row in enumerate(self._map):
            for j, cell in enumerate(row):
                if len(cell['unit']) == 0:
                    continue
                unit_locs[cell['unit']['id']] = [i, j]
                static_units.add(cell['unit']['id'])
                unit_data[cell['unit']['id']] = cell['unit']

        for i, move in enumerate(order66['moves']):
            dx = move['end'][0] - move['start'][0]
            steps = abs(dx)
            dx = int(dx / abs(dx)) if dx != 0 else 0

            dy = move['end'][1] - move['start'][1]
            dy = int(dy / abs(dy)) if dy != 0 else 0
            if steps == 0:
                steps = abs(dy)

            assert unit_locs[move['id']][0] == move['start'][0], "%d vs %d" % (
                    unit_locs[move['id']][0], move['start'][0])
            assert unit_locs[move['id']][1] == move['start'][1]

            unit_moves[move['id']] = {'dx': dx, 'dy': dy, 'steps': steps}
            static_units.remove(move['id'])

        print(static_units)
        print(unit_locs)
        print(unit_moves)

        next_step = [[-1 for _ in range(len(self._map[0]))]
                for _ in range(len(self._map))]

        for id in static_units:
            next_step[unit_locs[id][0]][unit_locs[id][1]] = -2

        full_move_units = set([])

        while True:
            if len(unit_moves) == 0:
                break
            keys = list(unit_moves.keys())
            for unit_id in keys:
                if unit_id not in unit_moves.keys():
                    continue
                if unit_moves[unit_id]['steps'] == 0:
                    del unit_moves[unit_id]
                    full_move_units.add(unit_id)
                    continue
                
                new_x = unit_locs[unit_id][0] + unit_moves[unit_id]['dx']
                new_y = unit_locs[unit_id][1] + unit_moves[unit_id]['dy']
                unit_moves[unit_id]['steps'] -= 1

                # check for conflict:
                if next_step[new_x][new_y] != -1:
                    # mark conflicted squares as dead
                    other_unit_id = next_step[new_x][new_y]
                    # delete other bounced units moves
                    if other_unit_id != -2:
                        next_step[new_x][new_y] = -2
                        del unit_moves[other_unit_id]
                    # delete future moves on this unit
                    del unit_moves[unit_id]
                else:
                    next_step[new_x][new_y] = unit_id

            for i, row in enumerate(next_step):
                for j, cell in enumerate(row):
                    if cell >= 0:
                        unit_locs[cell][0] = i
                        unit_locs[cell][1] = j

        for i, row in enumerate(self._map):
            for j, cell in enumerate(row):
                self._map[i][j]['unit'] = {}

        for unit_id in unit_locs:
            unit = unit_data[unit_id]
            x = unit_locs[unit_id][0]
            y = unit_locs[unit_id][1]
            self._map[x][y]['unit'] = unit

        anims_to_play = []

        for attack in order66['attacks']:
            if attack['id'] in full_move_units \
                or attack['id'] in static_units: # execute
                anims_to_play.append({
                    'type': attack['type'],
                    'start': unit_locs[attack['id']],
                    'end': attack['target']
                })

        # TODO compute damage????

        rv = {
            'board': self._map, 
            'animations': anims_to_play
        }

        print(json.dumps(rv))

        return rv
