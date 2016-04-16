```js
return this
	.target(enemy.all)
	.addMagic()
	.add(5)
	.withBoost(1, 3)
	.attack()
;
```

# Syntax
ValueSet MagicPlus 0

BoostRatio 3                // 3x multiplier
BoostRatio 1 3              // x/3 multiplier
BoostAdd $PrevInstruction

ValueSet Max                // e.g. Destroy armor

RangeMode True
ValueMax MagicPlus 14


StatTargetSet Armor
StatTargetSet Health
StatTargetSet Power
StatTargetSet Magic
StatTargetSet ArmorThenHealth
StatTargetSet ArmorThenHealth & Power
StatTargetSet Power & Magic

Target Enemy.Select
Target Enemy.All
Target Enemy.Random
Target Enemy.Line.Front
Target Enemy.Line.Back
Target Enemy.Line.Left
Target Enemy.Line.Right
Target Enemy.Line.Same
Target Enemy.Healthiest
Target Enemy.Weakest

Target Ally.Select
Target Ally.All
Target Ally.Random
Target Ally.Line.Front
Target Ally.Line.Back
Target Ally.Line.Left
Target Ally.Line.Right
Target Ally.Line.SameRow
Target Ally.Line.SameColumn
Target Ally.Healthiest
Target Ally.Weakest
Target Ally.OneAdjacent
Target Ally.TwoAdjacent
Target Ally.SelectAdjacent

Target Targets.Adjacent
Target Targets.OtherAllies

Attack
AttackSplit
Buff             // Can increase max health/armor
BuffSplit        // Can increase max health/armor
Steal

Heal             // Cannot increase max health
Repair           // Cannot increase max armor
DrainMana
Charm
Devour
Cleanse

ApplyStatus.Random
ApplyStatus.RandomUnapplied
ApplyStatus.RefreshApplied
ApplyStatus.Poison
ApplyStatus.Burn
ApplyStatus.Frozen
ApplyStatus.Silence
ApplyStatus.Entangle
ApplyStatus.Cleanse
ApplyStatus.HuntersMark
ApplyStatus.DeathMark

GainCurrency.Gold
GainCurrency.Souls
GainCurrency.Glory
GainCurrency.GamePiece
GainCurrency.Keys.Gold
GainCurrency.Keys.Glory
GainCurrency.Keys.Gem
GainCurrency.Keys.Event
GainCurrency.Keys.VIP
GainCurrency.TreasureMap

JumbleBoard
ReplaceBoard

ExtraTurn

Color.Select Random
Color.Select RandomNoSkull
Color.Select Blue
Color.Select Blue & Yellow
Color.Select Target.Random
Color.Select Target.All

GamePiece.Select Blue.All
GamePiece.Select Blue.Random 9
GamePiece.Select Blue.Random Value
GamePiece.Select SelectedColor 9
GamePiece.Select SelectedColor Value
GamePiece.Select SelectedColor.Random
GamePiece.Select SelectedColor.All

GamePiece.Select.Expand Row
GamePiece.Select.Expand Column
GamePiece.Select.Expand Row & Column
GamePiece.Select.Expand Box
GamePiece.Select.Expand LeftRight
GamePiece.Select.Expand AboveBelow

GamePiece.Transform Green
GamePiece.Remove
GamePiece.Destroy
GamePiece.Explode

GamePiece.Create Red 9
GamePiece.Create Red Value
GamePiece.Create Red MagicPlus 2
GamePiece.Create Red & Yellow MagicPlus 0

Spawn.Unit barbarian 15
Spawn.Unit barbarian MagicPlus 10

If EnemyDies
Target.Self
ValueSet 3
StatTargetSet Magic
Buff
EndIf

If ChancePercent 10
TargetEnemy.All
Burn
EndIf

If ChanceFraction 1 3
Devour
EndIf

If Target.HasTag human
ValueAdd 3
EndIf