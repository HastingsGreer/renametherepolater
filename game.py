from typing import *
import json
from attacks import ATTACK_LOOKUP, ENVIRONMENT_LOOKUP

class Game(object):
    def __init__(self, init_map):
        self._map = init_map

    def _gather_unit_information(self) -> Tuple[Dict[int, List[int]], Dict[int, Dict]]:

        unit_locs = {}
        unit_data = {}

        for i, row in enumerate(self._map):
            for j, cell in enumerate(row):
                if len(cell['unit']) == 0:
                    continue
                unit_locs[cell['unit']['id']] = [i, j]
                unit_data[cell['unit']['id']] = cell['unit']

        return unit_locs, unit_data

    def _parse_moves(self,
            static_units: Set[int],
            unit_locs: Dict[int, List[int]],
            moves: List[Dict]) -> Dict[int, Dict]:

        unit_moves = {}

        for i, move in enumerate(moves):
            dx = move['end'][0] - move['start'][0]
            steps = abs(dx)
            dx = int(dx / abs(dx)) if dx != 0 else 0

            dy = move['end'][1] - move['start'][1]
            if steps == 0:
                steps = abs(dy)
            dy = int(dy / abs(dy)) if dy != 0 else 0

            assert unit_locs[move['id']][0] == move['start'][0], "%d vs %d" % (
                    unit_locs[move['id']][0], move['start'][0])
            assert unit_locs[move['id']][1] == move['start'][1]

            unit_moves[move['id']] = {'dx': dx, 'dy': dy, 'steps': steps}
            static_units.remove(move['id'])

        return unit_moves

    def _execute_move_side_effects(self,
            x: int,
            y: int,
            unit_data: Dict) -> None:

        # execute side-effects on board
        if unit_data['type'] == 'flower_girl':
            self._map[x][y]["background"] = "flowers"

    def _execute_moves(self,
            static_units: Set[int],
            unit_locs: Dict[int, List[int]],
            unit_data: Dict[int, Dict],
            unit_moves: Dict[int, Dict]) -> Set[int]:

        move_animations = {}
        for id in unit_locs.keys():
            move_animations[id] = {"id": id, "start": unit_locs[id][:]}

        next_step = [[-1 for _ in range(len(self._map[0]))]
                for _ in range(len(self._map))]

        for id in static_units:
            next_step[unit_locs[id][0]][unit_locs[id][1]] = -2

        full_move_units = set([])
        stopped_units = set([])

        while True:
            next_step = [[-1 for _ in range(len(self._map[0]))]
                    for _ in range(len(self._map))]

            keys = list(unit_moves.keys())
            for unit_id in keys:
                if unit_moves[unit_id]['steps'] == 0:
                    del unit_moves[unit_id]
                    full_move_units.add(unit_id)

            for id in (static_units | stopped_units | full_move_units):
                next_step[unit_locs[id][0]][unit_locs[id][1]] = -2

            if len(unit_moves) == 0:
                break

            keys = list(unit_moves.keys())
            for unit_id in keys:
                if unit_id not in unit_moves.keys():
                    continue
                
                cur_x = unit_locs[unit_id][0]
                cur_y = unit_locs[unit_id][1]
                new_x = cur_x + unit_moves[unit_id]['dx']
                new_y = cur_y + unit_moves[unit_id]['dy']
                unit_moves[unit_id]['steps'] -= 1

                print(new_x)
                print(new_y)

                # check for conflict (odd, aka, move onto same square):
                if next_step[new_x][new_y] != -1:
                    # mark conflicted squares as dead
                    other_unit_id = next_step[new_x][new_y]
                    # delete other bounced units moves
                    if other_unit_id != -2:
                        next_step[new_x][new_y] = -2
                        stopped_units.add(other_unit_id)
                        del unit_moves[other_unit_id]
                    # delete future moves on this unit
                    stopped_units.add(unit_id)
                    del unit_moves[unit_id]
                else:
                    next_step[new_x][new_y] = unit_id

                # check for conflict (even, aka cross facing each other):
                for other_id in unit_locs:
                    if unit_locs[other_id][0] == new_x and \
                        unit_locs[other_id][1] == new_y and \
                        other_id in unit_moves:
                        # check if they are facing the exact opposite direction
                        if unit_moves[other_id]['dx'] == \
                            -1 * unit_moves[unit_id]['dx'] and \
                            unit_moves[other_id]['dy'] == \
                            -1 * unit_moves[unit_id]['dy']:
                            next_step[new_x][new_y] = -2
                            next_step[new_x][new_y] = -2
                            next_step[cur_x][cur_y] = -2
                            next_step[cur_x][cur_y] = -2
                            stopped_units.add(other_id)
                            stopped_units.add(unit_id)
                            del unit_moves[other_id]
                            del unit_moves[unit_id]

            print("="*20)
            for row in next_step:
                print(row)
            print("="*20)

            for i, row in enumerate(next_step):
                for j, cell in enumerate(row):
                    if cell >= 0:
                        cur_x = unit_locs[cell][0]
                        cur_y = unit_locs[cell][1]
                        self._execute_move_side_effects(cur_x, cur_y,
                                unit_data[cell])
                        # move the unit
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
            move_animations[unit_id]['end'] = unit_locs[unit_id][:]

        return full_move_units, list(move_animations.values())

    def _prune_attacks(self,
            available_units: Set[int],
            attacks: List[Dict]):

        went_through = []
        for attack in attacks:
            if attack['id'] not in available_units:
                continue
            went_through.append(attack)
        return went_through

    # takes in list of client attacks, returns a list of animation
    def _perform_attacks(self,
            unit_locs: Dict[int, List[int]],
            attacks: List[Dict]) -> List[Dict]:
        anims_to_play = []

        for attack in attacks:
            target = attack['target']
            anims_to_play.append({
                'type': attack['type'],
                'start': unit_locs[attack['id']],
                'end': attack['target']
            })

            # of course this should be pretty straightforward
            ATTACK_LOOKUP[attack['type']]                                               \
            (target[0], target[1], self, attack['id'])

        return anims_to_play

    def _perform_environment_damage(self):
        for x, row in enumerate(self._map):
            for y, cell in enumerate(row):
                background = self._map[x][y]['background']
                ENVIRONMENT_LOOKUP[background]                                          \
                (x, y, self)

    def _check_win(self):
        owners = set([])
        for x, row in enumerate(self._map):
            for y, cell in enumerate(row):
                unit = self._map[x][y]['unit']
                if len(unit) == 0:
                    continue
                owners.add(unit['owner'])
        if len(owners) == 2:
            return None
        return list(owners)[0]

    def _check_healing(self):
        for x, row in enumerate(self._map):
            for y, cell in enumerate(row):
                if len(cell['unit']) != 0 and cell['unit']['happiness'] > 100:
                    self._map[x][y]['unit'] = {}

    def execute(self, order66: Dict):
        print(order66)
        unit_locs, unit_data = self._gather_unit_information()
        # set of units that did not move in the last turn
        static_units = set(list(unit_locs.keys()))
        unit_moves = self._parse_moves(static_units, unit_locs, order66['moves'])
        print(unit_moves)
        full_move_units, move_anims = self._execute_moves(static_units, unit_locs,
                unit_data, unit_moves)

        can_attack = full_move_units | static_units
        attacks = self._prune_attacks(can_attack, order66['attacks'])

        attack_anims = self._perform_attacks(unit_locs, attacks)
        self._perform_environment_damage()
        self._check_healing()

        rv = {
            'board': self._map, 
            'animations': {
                'moves': move_anims,
                'attacks': attack_anims
            }
        }

        print(json.dumps(rv))

        winner = self._check_win()

        return winner, rv
