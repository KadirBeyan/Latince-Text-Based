# Village Life RPG Loop Coverage Report

*Generated automatically on 23.06.2026*

## Summary Metrics
- **Total Activities**: 20
- **Total Ambient Events**: 12
- **Unique NPCs Tracked**: 9
- **Scenes Configured in Campaign**: 38

## Activity Scene Validity
> [!NOTE]
> **All 20 activity sceneIds are successfully registered as active scenes in `vicus.json`!**

## Activity Distribution by Location
| Location ID | Activity Count |
| --- | --- |
| `home_hut` | 3 |
| `village_path` | 1 |
| `veteran_bench` | 3 |
| `village_market` | 3 |
| `scribe_table` | 2 |
| `shrine` | 3 |
| `teacher_corner` | 2 |
| `field_edge` | 3 |

## Activity Distribution by Time Window
| Time of Day | Available Activities |
| --- | --- |
| `mane` | 11 |
| `meridies` | 12 |
| `vesper` | 7 |
| `nox` | 1 |

## NPC Activity Connections
| NPC ID | Activity Appearances | Scheduled Locations (Mane / Meridies / Vesper / Nox) |
| --- | --- | --- |
| `mater` | 2 | home_hut / village_market / home_hut / home_hut |
| `pater` | 3 | home_hut / field_edge / village_path / home_hut |
| `avia` | 2 | home_hut / home_hut / home_hut / home_hut |
| `magister_ruralis` | 2 | teacher_corner / teacher_corner / village_path / home_hut |
| `mercator_vicus` | 3 | village_market / village_market / village_path / home_hut |
| `veteranus` | 3 | veteran_bench / veteran_bench / shrine / home_hut |
| `scriba_vicus` | 2 | scribe_table / scribe_table / scribe_table / home_hut |
| `ministra` | 3 | shrine / shrine / shrine / home_hut |
| `amicus` | 2 | village_path / field_edge / village_path / home_hut |

## Career Path Weight (Affinities)
| Career Path (Fatum) | Combined Reward Value |
| --- | --- |
| **LUDUS** | +7 |
| **CASTRA** | +8 |
| **MERCATURA** | +8 |
| **SCRIPTURA** | +6 |
| **TEMPLUM** | +7 |
| **VILLA** | +10 |
| **AUCTORITAS** | +1 |

## Ambient Events List
| ID | Location | Time Windows | Once? | Condition Count |
| --- | --- | --- | --- | --- |
| `market_dispute` | `village_market` | meridies | No | 0 |
| `veteran_military_drill` | `veteran_bench` | mane | No | 0 |
| `scribe_new_parchment` | `scribe_table` | meridies | No | 0 |
| `shrine_procession` | `shrine` | vesper | No | 0 |
| `path_stranger` | `village_path` | vesper | No | 0 |
| `field_storm_clouds` | `field_edge` | vesper | No | 0 |
| `home_old_tales` | `home_hut` | nox | Yes | 0 |
| `teacher_good_pupil` | `teacher_corner` | mane | No | 0 |
| `market_rare_coin` | `village_market` | meridies | No | 0 |
| `shrine_silent_prayer` | `shrine` | mane | No | 0 |
| `path_merchant_wagon` | `village_path` | meridies | No | 0 |
| `field_wild_boar` | `field_edge` | mane | No | 0 |
