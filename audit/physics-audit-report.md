# Physics Audit Report

- System: battery-magnet train inside an uninsulated copper solenoid
- Sign convention: +1 right, -1 left, 0 no sustained motion
- Result: 7/7 invariants passed

| Status | Case | Direction | Relative force |
|---|---|---:|---:|
| PASS | closed-aligned-right | 1 | 60% |
| PASS | closed-aligned-left | -1 | 60% |
| PASS | open-circuit | 0 | 0% |
| PASS | reversed-magnet | 0 | 0% |
| PASS | low-voltage-boundary | 1 | 20% |
| PASS | voltage-clamped-high | 1 | 60% |
| PASS | voltage-clamped-low | 1 | 20% |

Relative force is a teaching index, not a value in newtons. Friction, contact resistance, battery internal resistance, heating and terminal speed are outside this model.
