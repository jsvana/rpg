/* TODO LIST
 - Make all items/weapons/armor/spells XML
  Load into tile translation and action function dynamically
 - Spells
 - Equipment - IMPLEMENT IN BATTLE
 - Item Shop
 - Weapon Shop
 - Dynamic tile addition, translation (see JSEvalTest.php)? (Maybe even PHP (or just hardcode))
 - New Character dialog et al.
 - Add/implement menu
  Resume Game - DONE
  Save Game - ADD SAVING OF ACQUIRED ITEMS
  Load Game - ADD LOADING OF ACQUIRED ITEMS
  Quit
 - Mini map
*/

/* Globals */

/* Enumerables */

var ArmorType = {"shield" : 0, "helmet" : 1, "armorTop" : 2, "armorBottom" : 3};
var ItemType = {"item" : 0, "weapon" : 1, "armor" : 2, "spell" : 3};
var WeaponType = {"sword" : 0};
var HealingType = {"hp" : 0, "mp" : 1};
var Tiles = {"grass" : 0, "water" : 1, "shallowWater" : 2, "potion" : 3, "ether" : 4, "warp" : 5, "treeBottomLeft" : 6, "treeBottomRight" : 7, "inn" : 8};
var Items = {"none" : 0, "potion" : 1, "ether" : 2, "warp" : 3};
var ItemNames = {"none" : "None", "potion" : "Potion", "ether" : "Ether", "warp" : "Warp"};
var Spells = {"heal" : 0, "flare" : 1};
var EntityDestination = {"hero" : 0, "enemy" : 1};
var Destination = {"other" : 0, "hp" : 1, "mp" : 2};
var WeaponEnum = {"none" : 0, "woodenSword" : 1, "steelLongsword" : 2};
var ArmorEnum = {"none" : 0, "woodenShield" : 1, "clothHat" : 2, "clothShirt" : 3, "clothPants" : 4, "steelFullHelmet" : 5};
var Directions = {"up" : 0, "down" : 1, "left" : 2, "right" : 3};
var Genders = {"male" : 0, "female" : 1};
var GenderNames = new Array("Male", "Female");
var Races = {"human" : 0, "elf" : 1};
var RaceNames = new Array("Human", "Elf");
var Classes = {"warrior" : 0, "cleric" : 1};
var ClassNames = new Array("Warrior", "Cleric");

/* General Functions */

// MUST OPTIMIZE
function UseItem(data, hero)
{
  var vals = data.split(",");
  var itemType = parseInt(vals[0]);
  var item = parseInt(vals[1]);
  var index = parseInt(vals[2]);
  var result;

  switch(itemType)
  {
    case ItemType.item:
      switch(item)
      {
        case Items.potion:
          var result = new ItemResult();

          result.Index = index;
          result.Item = Items.potion;
          result.DestinationEntity = EntityDestination.hero;
          result.Destination = Destination.hp;
          result.Power = 10;

          HealingItem(result, hero);

          break;

        case Items.ether:
          var result = new ItemResult();

          result.Index = index;
          result.Item = Items.ether;
          result.DestinationEntity = EntityDestination.hero;
          result.Destination = Destination.mp;
          result.Power = 10;

          HealingItem(result, hero);

          break;

        case Items.warp:
          var result = new ItemResult();

          result.Index = index;
          result.Item = Items.warp;
          result.DestinationEntity = EntityDestination.hero;
          result.Destination = Destination.other;
          result.Power = -1;

          world.curMapX = 0;
          world.curMapY = 0;
          world.heroX = 0;
          world.heroY = 0;

          world.Translate();
          world.Draw();

          $("#info").html("You were warped!");

          hero.Items.RemoveItemAt(result.Index);

          $("#info").stopTime();

          $("#info").oneTime(1000, "clear", function(){
            $("#info").html("");
          });

          break;

        default:
          $("#info").html("This item cannot be used in the field.");

          $("#info").stopTime();

          $("#info").oneTime(1000, "clear", function(){
            $("#info").html("");
          });

          break;
      }

      break;

    case ItemType.weapon:
      switch(item)
      {
      }

      break;

    case ItemType.armor:
      switch(item)
      {
      }

      break;
  }

  SetStats(hero);
  SetItems(hero);
}

function HealingItem(result, hero)
{
  var dest;

  switch(result.Destination)
  {
    case Destination.hp:
      dest = "HP";

      break;

    case Destination.mp:
      dest = "MP";

      break;

    case Destination.other:
      healing = false;

      break;
  }

  if(eval("hero.Max" + dest + " - hero." + dest + " > result.Power"))
  {
    eval("hero." + dest + " += result.Power");

    $("#info").html(result.Power + " " + dest + " recovered.");

    hero.Items.RemoveItemAt(result.Index);
  }
  else if(eval("hero." + dest + " == hero.Max" + dest))
    $("#info").html(dest + " is already full!");
  else
  {
    $("#info").html(eval("hero.Max" + dest + " - hero." + dest) + " " + dest + " recovered.");

    eval("hero." + dest + " = hero.Max" + dest);

    hero.Items.RemoveItemAt(result.Index);
  }

  $("#info").stopTime();

  $("#info").oneTime(1000, "clear", function(){
    $("#info").html("");
  });
}

function EquipItem(data, hero)
{
  var vals = data.split(",");
  var itemType = parseInt(vals[0]);
  var item = parseInt(vals[1]);
  var index = parseInt(vals[2]);

  switch(itemType)
  {
    case ItemType.item:
      switch(item)
      {
        default:
          $("#info").html("This item cannot be equipped.");

          $("#info").stopTime();

          $("#info").oneTime(1000, "clear", function(){
            $("#info").html("");
          });

          break;
      }

      break;

    case ItemType.weapon:
      switch(item)
      {
        case WeaponEnum.woodenSword:
        case WeaponEnum.steelLongsword:
          var temp = new Weapon();
          temp.Name = hero.Sword.Name;
          temp.WeaponEnum = hero.Sword.WeaponEnum;
          temp.AttackBonus = hero.Sword.AttackBonus;
          temp.DefenseBonus = hero.Sword.DefenseBonus;
          temp.AgilityBonus = hero.Sword.AgilityBonus;
          temp.IntelligenceBonus = hero.Sword.IntelligenceBonus;
          temp.LuckBonus = hero.Sword.LuckBonus;
          temp.Value = hero.Sword.Value;
          temp.Weight = hero.Sword.Weight;
          temp.Power = hero.Sword.Power;

          var newWeapon = hero.Weapons.GetItemAt(index);

          hero.Sword.Name = newWeapon.Name;
          hero.Sword.WeaponEnum = newWeapon.WeaponEnum;
          hero.Sword.AttackBonus = newWeapon.AttackBonus;
          hero.Sword.DefenseBonus = newWeapon.DefenseBonus;
          hero.Sword.AgilityBonus = newWeapon.AgilityBonus;
          hero.Sword.IntelligenceBonus = newWeapon.IntelligenceBonus;
          hero.Sword.LuckBonus = newWeapon.LuckBonus;
          hero.Sword.Value = newWeapon.Value;
          hero.Sword.Weight = newWeapon.Weight;
          hero.Sword.Power = newWeapon.Power;

          hero.Weapons.RemoveItemAt(index);
          hero.Weapons.AddItem(temp);

          SetAll(hero);

          break;

        default:
          $("#info").html("This item cannot be equipped.");

          $("#info").stopTime();

          $("#info").oneTime(1000, "clear", function(){
            $("#info").html("");
          });

          break;
      }

      break;

    case ItemType.armor:
      switch(item)
      {
        case ArmorEnum.clothHat:
        case ArmorEnum.steelFullHelmet:
          var armorType;

          switch(hero.Armor.GetItemAt(index).ArmorType)
          {
            case ArmorType.shield:
              armorType = "Shield";

              break;

            case ArmorType.helmet:
              armorType = "Helmet";

              break;

            case ArmorType.armorTop:
              armorType = "ArmorTop";

              break;

            case ArmorType.armorBottom:
              armorType = "ArmorBottom";

              break;

          }

          var temp = new Armor();
          eval("temp.Name = hero." + armorType + ".Name;temp.ArmorEnum = hero." + armorType + ".ArmorEnum;temp.AttackBonus = hero." + armorType + ".AttackBonus;temp.DefenseBonus = hero." + armorType + ".DefenseBonus;temp.AgilityBonus = hero." + armorType + ".AgilityBonus;temp.IntelligenceBonus = hero." + armorType + ".IntelligenceBonus;temp.LuckBonus = hero." + armorType + ".LuckBonus;temp.Value = hero." + armorType + ".Value;temp.Weight = hero." + armorType + ".Weight;temp.ArmorType = hero." + armorType + ".ArmorType;temp.Defense = hero." + armorType + ".Defense;");

          var newArmor = hero.Armor.GetItemAt(index);

          eval("hero." + armorType + ".Name = newArmor.Name;hero." + armorType + ".ArmorEnum = newArmor.ArmorEnum;hero." + armorType + ".AttackBonus = newArmor.AttackBonus;hero." + armorType + ".DefenseBonus = newArmor.DefenseBonus;hero." + armorType + ".AgilityBonus = newArmor.AgilityBonus;hero." + armorType + ".IntelligenceBonus = newArmor.IntelligenceBonus;hero." + armorType + ".LuckBonus = newArmor.LuckBonus;hero." + armorType + ".Value = newArmor.Value;hero." + armorType + ".Weight = newArmor.Weight;hero." + armorType + ".ArmorType = newArmor.ArmorType;hero." + armorType + ".Defense = newArmor.Defense;");

          //Sometimes throws error "No such column: undefined" when saved

          hero.Armor.RemoveItemAt(index);
          hero.Armor.AddItem(temp);

          SetAll(hero);

          break;

        default:
          $("#info").html("This item cannot be equipped.");

          $("#info").stopTime();

          $("#info").oneTime(1000, "clear", function(){
            $("#info").html("");
          });

          break;
      }

      break;
  }
}

/*function UseSpell(spell)
{
  switch(spell)
  {
    case Spells.heal:
  }
}*/

/* Models */

function Tile()
{
  this.tile = 0;
  this.walkable = true;
  this.isTransitionLeft = false;
  this.isTransitionRight = false;
  this.isTransitionUp = false;
  this.isTransitionDown = false;
  this.isWild = false;
  this.isItem = false;
  this.itemType = Items.none;
}

function Hero()
{
  this.ID = 0;

  this.Name = "Player";
  this.Gender = Genders.male;
  this.Race = Races.human;
  this.Class = Classes.warrior;

  this.HP = 100;
  this.MaxHP = 100;
  this.MP = 20;
  this.MaxMP = 20;

  this.Sword = new Weapon();
  this.Shield = new Armor(ArmorType.shield);
  this.Helmet = new Armor(ArmorType.helmet);
  this.ArmorTop = new Armor(ArmorType.armorTop);
  this.ArmorBottom = new Armor(ArmorType.armorBottom);

  this.Sword.Name = "Wooden Sword";
  this.Sword.WeaponEnum = WeaponEnum.woodenSword;
  this.Sword.AttackBonus = 2;
  this.Sword.Value = 5;
  this.Sword.Weight = 2;
  this.Sword.Power = 4;

  this.Shield.Name = "Wooden Shield";
  this.Shield.ArmorEnum = ArmorEnum.woodenShield;
  this.Shield.DefenseBonus = 2;
  this.Shield.Value = 3;
  this.Shield.Weight = 3;
  this.Shield.Defense = 3;

  this.Helmet.Name = "Cloth Hat";
  this.Helmet.ArmorEnum = ArmorEnum.clothHat;
  this.Helmet.DefenseBonus = 0;
  this.Helmet.Value = 1;
  this.Helmet.Weight = 1;
  this.Helmet.Defense = 1;

  this.ArmorTop.Name = "Cloth Shirt";
  this.ArmorTop.ArmorEnum = ArmorEnum.clothShirt;
  this.ArmorTop.DefenseBonus = 0;
  this.ArmorTop.Value = 2;
  this.ArmorTop.Weight = 1;
  this.ArmorTop.Defense = 1;

  this.ArmorBottom.Name = "Cloth Pants";
  this.ArmorBottom.ArmorEnum = ArmorEnum.clothPants;
  this.ArmorBottom.DefenseBonus = 0;
  this.ArmorBottom.Value = 2;
  this.ArmorBottom.Weight = 1;
  this.ArmorBottom.Defense = 1;

  /* Spells and Items */

  this.Items = new ItemList();
  this.Weapons = new ItemList();
  this.Armor = new ItemList();

  this.Spells = new ItemList();

  /*var temp = new Spell();
  temp.Name = "Heal";
  temp.Spell = Spells.heal;
  temp.Cost = 5;

  this.Spells.AddItem(temp);*/

  var tempWeapon = new Weapon();
  tempWeapon.Name = "Steel Longsword";
  tempWeapon.WeaponEnum = WeaponEnum.steelLongsword;
  tempWeapon.AttackBonus = 5;
  tempWeapon.DefenseBonus = 0;
  tempWeapon.AgilityBonus = 0;
  tempWeapon.IntelligenceBonus = 0;
  tempWeapon.LuckBonus = 0;
  tempWeapon.Value = 20;
  tempWeapon.Weight = 7;
  tempWeapon.Power = 10;

  this.Weapons.AddItem(tempWeapon);

  var tempArmor = new Armor();
  tempArmor.Name = "Steel Full Helmet";
  tempArmor.ArmorEnum = ArmorEnum.steelFullHelmet;
  tempArmor.AttackBonus = 0;
  tempArmor.DefenseBonus = 3;
  tempArmor.AgilityBonus = 0;
  tempArmor.IntelligenceBonus = 0;
  tempArmor.LuckBonus = 0;
  tempArmor.Value = 15;
  tempArmor.Weight = 4;
  tempArmor.ArmorType = ArmorType.helmet;
  tempArmor.Defense = 10;

  this.Armor.AddItem(tempArmor);

  this.Attack = Math.floor(Math.random() * 5 + 1);
  this.Defense = Math.floor(Math.random() * 5 + 1);
  this.Agility = Math.floor(Math.random() * 5 + 1);
  this.Intelligence = Math.floor(Math.random() * 5 + 1);
  this.Luck = Math.floor(Math.random() * 5 + 1);

  this.Level = 1;
  this.Experience = 0;
  this.Gold = 0;

  /* Direction */

  this.InBattle = false;

  this.Save = function(tx, char, slot)
  {
    var hero = char;
    var id = slot;

    //var query = "INSERT into characters (name, gender, race, class, hp, maxHP, mp, maxMP, swordName, swordEnum, swordAttackBonus, swordDefenseBonus, swordAgilityBonus, swordIntelligenceBonus, swordLuckBonus, swordValue, swordWeight, swordPower, shieldName, shieldEnum, shieldAttackBonus, shieldDefenseBonus, shieldAgilityBonus, shieldIntelligenceBonus, shieldLuckBonus, shieldValue, shieldWeight, shieldDefense, helmetName, helmetEnum, helmetAttackBonus, helmetDefenseBonus, helmetAgilityBonus, helmetIntelligenceBonus, helmetLuckBonus, helmetValue, helmetWeight, helmetDefense, armorTopName, armorTopEnum, armorTopAttackBonus, armorTopDefenseBonus, armorTopAgilityBonus, armorTopIntelligenceBonus, armorTopLuckBonus, armorTopValue, armorTopWeight, armorTopDefense, armorBottomName, armorBottomEnum, armorBottomAttackBonus, armorBottomDefenseBonus, armorBottomAgilityBonus, armorBottomIntelligenceBonus, armorBottomLuckBonus, armorBottomValue, armorBottomWeight, armorBottomDefense, attack, defense, agility, intelligence, luck, level, experience, gold) VALUES ('" + this.Name + "', " + this.Gender + ", " + this.Race + ", " + this.Class + ", " + this.HP + ", " + this.MaxHP + ", " + this.MP + ", " + this.MaxMP + ", '" + this.Sword.Name + "', " + this.Sword.WeaponEnum + ", " + this.Sword.AttackBonus + ", " + this.Sword.DefenseBonus + ", " + this.Sword.AgilityBonus + ", " + this.Sword.IntelligenceBonus + ", " + this.Sword.LuckBonus + ", " + this.Sword.Value + ", " + this.Sword.Weight + ", " + this.Sword.Power + ", '" + this.Shield.Name + "', " + this.Shield.ArmorEnum + ", " + this.Shield.AttackBonus + ", " + this.Shield.DefenseBonus + ", " + this.Shield.AgilityBonus + ", " + this.Shield.IntelligenceBonus + ", " + this.Shield.LuckBonus + ", " + this.Shield.Value + ", " + this.Shield.Weight + ", " + this.Shield.Defense + ", '" + this.Helmet.Name + "', " + this.Helmet.ArmorEnum + ", " + this.Helmet.AttackBonus + ", " + this.Helmet.DefenseBonus + ", " + this.Helmet.AgilityBonus + ", " + this.Helmet.IntelligenceBonus + ", " + this.Helmet.LuckBonus + ", " + this.Helmet.Value + ", " + this.Helmet.Weight + ", " + this.Helmet.Defense + ", '" + this.ArmorTop.Name + "', " + this.ArmorTop.ArmorEnum + ", " + this.ArmorTop.AttackBonus + ", " + this.ArmorTop.DefenseBonus + ", " + this.ArmorTop.AgilityBonus + ", " + this.ArmorTop.IntelligenceBonus + ", " + this.ArmorTop.LuckBonus + ", " + this.ArmorTop.Value + ", " + this.ArmorTop.Weight + ", " + this.ArmorTop.Defense + ", '" + this.ArmorBottom.Name + "', " + this.ArmorBottom.ArmorEnum + ", " + this.ArmorBottom.AttackBonus + ", " + this.ArmorBottom.DefenseBonus + ", " + this.ArmorBottom.AgilityBonus + ", " + this.ArmorBottom.IntelligenceBonus + ", " + this.ArmorBottom.LuckBonus + ", " + this.ArmorBottom.Value + ", " + this.ArmorBottom.Weight + ", " + this.ArmorBottom.Defense + ", " + this.Attack + ", " + this.Defense + ", " + this.Agility + ", " + this.Intelligence + ", " + this.Luck + ", " + this.Level + ", " + this.Experience + ", " + this.Gold + ");";

    tx.executeSql("SELECT * from characters where id=" + slot + ";", [],
      function(tx, result)
      {
        try
        {
          var temp = result.rows.item(0);

          confirm.Data = tx;
          confirm.Question = "Save file already exists.  Overwrite?";
          confirm.End = function(result)
          {
            if(!result)
              return;

            var query = "UPDATE characters set name='" + hero.Name + "', gender=" + hero.Gender + ", race=" + hero.Race + ", class=" + hero.Class + ", hp=" + hero.HP + ", maxHP=" + hero.MaxHP + ", mp=" + hero.MP + ", maxMP=" + hero.MaxMP + ", swordName='" + hero.Sword.Name + "', swordEnum=" + hero.Sword.WeaponEnum + ", swordAttackBonus=" + hero.Sword.AttackBonus + ", swordDefenseBonus=" + hero.Sword.DefenseBonus + ", swordAgilityBonus=" + hero.Sword.AgilityBonus + ", swordIntelligenceBonus=" + hero.Sword.IntelligenceBonus + ", swordLuckBonus=" + hero.Sword.LuckBonus + ", swordValue=" + hero.Sword.Value + ", swordWeight=" + hero.Sword.Weight + ", swordPower=" + hero.Sword.Power + ", shieldName='" + hero.Shield.Name + "', shieldEnum=" + hero.Shield.ArmorEnum + ", shieldAttackBonus=" + hero.Shield.AttackBonus + ", shieldDefenseBonus=" + hero.Shield.DefenseBonus + ", shieldAgilityBonus=" + hero.Shield.AgilityBonus + ", shieldIntelligenceBonus=" + hero.Shield.IntelligenceBonus + ", shieldLuckBonus=" + hero.Shield.LuckBonus + ", shieldValue=" + hero.Shield.Value + ", shieldWeight=" + hero.Shield.Weight + ", shieldDefense=" + hero.Shield.Defense + ", helmetName='" + hero.Helmet.Name + "', helmetEnum=" + hero.Helmet.ArmorEnum + ", helmetAttackBonus=" + hero.Helmet.AttackBonus + ", helmetDefenseBonus=" + hero.Helmet.DefenseBonus + ", helmetAgilityBonus=" + hero.Helmet.AgilityBonus + ", helmetIntelligenceBonus=" + hero.Helmet.IntelligenceBonus + ", helmetLuckBonus=" + hero.Helmet.LuckBonus + ", helmetValue=" + hero.Helmet.Value + ", helmetWeight=" + hero.Helmet.Weight + ", helmetDefense=" + hero.Helmet.Defense + ", armorTopName='" + hero.ArmorTop.Name + "', armorTopEnum=" + hero.ArmorTop.ArmorEnum + ", armorTopAttackBonus=" + hero.ArmorTop.AttackBonus + ", armorTopDefenseBonus=" + hero.ArmorTop.DefenseBonus + ", armorTopAgilityBonus=" + hero.ArmorTop.AgilityBonus + ", armorTopIntelligenceBonus=" + hero.ArmorTop.IntelligenceBonus + ", armorTopLuckBonus=" + hero.ArmorTop.LuckBonus + ", armorTopValue=" + hero.ArmorTop.Value + ", armorTopWeight=" + hero.ArmorTop.Weight + ", armorTopDefense=" + hero.ArmorTop.Defense + ", armorBottomName='" + hero.ArmorBottom.Name + "', armorBottomEnum=" + hero.ArmorBottom.ArmorEnum + ", armorBottomAttackBonus=" + hero.ArmorBottom.AttackBonus + ", armorBottomDefenseBonus=" + hero.ArmorBottom.DefenseBonus + ", armorBottomAgilityBonus=" + hero.ArmorBottom.AgilityBonus + ", armorBottomIntelligenceBonus=" + hero.ArmorBottom.IntelligenceBonus + ", armorBottomLuckBonus=" + hero.ArmorBottom.LuckBonus + ", armorBottomValue=" + hero.ArmorBottom.Value + ", armorBottomWeight=" + hero.ArmorBottom.Weight + ", armorBottomDefense=" + hero.ArmorBottom.Defense + ", attack=" + hero.Attack + ", defense=" + hero.Defense + ", agility=" + hero.Agility + ", intelligence=" + hero.Intelligence + ", luck=" + hero.Luck + ", level=" + hero.Level + ", experience=" + hero.Experience + ", gold=" + hero.Gold + " where id=" + slot + ";";

            var db = window.openDatabase("games", "", "Saved Games", 1024 * 1024);

            db.transaction(function(tx)
            {
              tx.executeSql(query, [],
              function(tx, result)
              {
                hero.Items.Save(tx, id, ItemType.item);
                hero.Weapons.Save(tx, id, ItemType.weapon);
                hero.Armor.Save(tx, id, ItemType.armor);
                hero.Spells.Save(tx, id, ItemType.spell);

                alertBox.Text = "Game saved successfully.";

                alertBox.End = function()
                {
                  SetAll(hero);

                  menuVisible = false;

                  $("#slotCover").hide();
                  $("#menuCover").fadeOut();
                }

                alertBox.Show();
              }, function(tx, error)
              {
                alert("Error saving game (" + error.message + ").");
              });
            });
          }

          confirm.Show();
        }
        catch(e)
        {
          var query = "INSERT into characters (name, gender, race, class, hp, maxHP, mp, maxMP, swordName, swordEnum, swordAttackBonus, swordDefenseBonus, swordAgilityBonus, swordIntelligenceBonus, swordLuckBonus, swordValue, swordWeight, swordPower, shieldName, shieldEnum, shieldAttackBonus, shieldDefenseBonus, shieldAgilityBonus, shieldIntelligenceBonus, shieldLuckBonus, shieldValue, shieldWeight, shieldDefense, helmetName, helmetEnum, helmetAttackBonus, helmetDefenseBonus, helmetAgilityBonus, helmetIntelligenceBonus, helmetLuckBonus, helmetValue, helmetWeight, helmetDefense, armorTopName, armorTopEnum, armorTopAttackBonus, armorTopDefenseBonus, armorTopAgilityBonus, armorTopIntelligenceBonus, armorTopLuckBonus, armorTopValue, armorTopWeight, armorTopDefense, armorBottomName, armorBottomEnum, armorBottomAttackBonus, armorBottomDefenseBonus, armorBottomAgilityBonus, armorBottomIntelligenceBonus, armorBottomLuckBonus, armorBottomValue, armorBottomWeight, armorBottomDefense, attack, defense, agility, intelligence, luck, level, experience, gold) VALUES ('" + hero.Name + "', " + hero.Gender + ", " + hero.Race + ", " + hero.Class + ", " + hero.HP + ", " + hero.MaxHP + ", " + hero.MP + ", " + hero.MaxMP + ", '" + hero.Sword.Name + "', " + hero.Sword.WeaponEnum + ", " + hero.Sword.AttackBonus + ", " + hero.Sword.DefenseBonus + ", " + hero.Sword.AgilityBonus + ", " + hero.Sword.IntelligenceBonus + ", " + hero.Sword.LuckBonus + ", " + hero.Sword.Value + ", " + hero.Sword.Weight + ", " + hero.Sword.Power + ", '" + hero.Shield.Name + "', " + hero.Shield.ArmorEnum + ", " + hero.Shield.AttackBonus + ", " + hero.Shield.DefenseBonus + ", " + hero.Shield.AgilityBonus + ", " + hero.Shield.IntelligenceBonus + ", " + hero.Shield.LuckBonus + ", " + hero.Shield.Value + ", " + hero.Shield.Weight + ", " + hero.Shield.Defense + ", '" + hero.Helmet.Name + "', " + hero.Helmet.ArmorEnum + ", " + hero.Helmet.AttackBonus + ", " + hero.Helmet.DefenseBonus + ", " + hero.Helmet.AgilityBonus + ", " + hero.Helmet.IntelligenceBonus + ", " + hero.Helmet.LuckBonus + ", " + hero.Helmet.Value + ", " + hero.Helmet.Weight + ", " + hero.Helmet.Defense + ", '" + hero.ArmorTop.Name + "', " + hero.ArmorTop.ArmorEnum + ", " + hero.ArmorTop.AttackBonus + ", " + hero.ArmorTop.DefenseBonus + ", " + hero.ArmorTop.AgilityBonus + ", " + hero.ArmorTop.IntelligenceBonus + ", " + hero.ArmorTop.LuckBonus + ", " + hero.ArmorTop.Value + ", " + hero.ArmorTop.Weight + ", " + hero.ArmorTop.Defense + ", '" + hero.ArmorBottom.Name + "', " + hero.ArmorBottom.ArmorEnum + ", " + hero.ArmorBottom.AttackBonus + ", " + hero.ArmorBottom.DefenseBonus + ", " + hero.ArmorBottom.AgilityBonus + ", " + hero.ArmorBottom.IntelligenceBonus + ", " + hero.ArmorBottom.LuckBonus + ", " + hero.ArmorBottom.Value + ", " + hero.ArmorBottom.Weight + ", " + hero.ArmorBottom.Defense + ", " + hero.Attack + ", " + hero.Defense + ", " + hero.Agility + ", " + hero.Intelligence + ", " + hero.Luck + ", " + hero.Level + ", " + hero.Experience + ", " + hero.Gold + ");";

          tx.executeSql(query, [],
          function(tx, result)
          {
            tx.executeSql("SELECT characters.id AS id, COUNT(*) from characters;", [],
            function(tx, result)
            {
              var row = result.rows.item(0);

              hero.Items.Save(tx, row['id'], ItemType.item);
              hero.Weapons.Save(tx, row['id'], ItemType.weapon);
              hero.Armor.Save(tx, row['id'], ItemType.armor);
              hero.Spells.Save(tx, row['id'], ItemType.spell);

              alertBox.Text = "Game saved successfully.";

              alertBox.End = function()
              {
                SetAll(hero);

                menuVisible = false;

                $("#slotCover").hide();
                $("#menuCover").fadeOut();
              }

              alertBox.Show();
            });
          },
          function(tx, error)
          {
            alert("Error saving game (" + error.message + ").");
          });
        }
      }, function(tx, error)
      {
        alert("Error saving game (" + error.message + ").");
      });
  }

  this.Load = function(tx, char, slot)
  {
    var hero = char;

    tx.executeSql("SELECT characters.id AS id, characters.name AS name, characters.gender AS gender, characters.race AS race, characters.class AS class, characters.hp AS hp, characters.maxHP AS maxHP, characters.mp AS mp, characters.maxMP AS maxMP, characters.swordName AS swordName, characters.swordEnum AS swordEnum, characters.swordAttackBonus AS swordAttackBonus, characters.swordDefenseBonus AS swordDefenseBonus, characters.swordAgilityBonus AS swordAgilityBonus, characters.swordIntelligenceBonus AS swordIntelligenceBonus, characters.swordLuckBonus AS swordLuckBonus, characters.swordValue AS swordValue, characters.swordWeight AS swordWeight, characters.swordPower AS swordPower, characters.shieldName AS shieldName, characters.shieldEnum AS shieldEnum, characters.shieldAttackBonus AS shieldAttackBonus, characters.shieldDefenseBonus AS shieldDefenseBonus, characters.shieldAgilityBonus AS shieldAgilityBonus, characters.shieldIntelligenceBonus AS shieldIntelligenceBonus, characters.shieldLuckBonus AS shieldLuckBonus, characters.shieldValue AS shieldValue, characters.shieldWeight AS shieldWeight, characters.shieldDefense AS shieldDefense, characters.helmetName AS helmetName, characters.helmetEnum AS helmetEnum, characters.helmetAttackBonus AS helmetAttackBonus, characters.helmetDefenseBonus AS helmetDefenseBonus, characters.helmetAgilityBonus AS helmetAgilityBonus, characters.helmetIntelligenceBonus AS helmetIntelligenceBonus, characters.helmetLuckBonus AS helmetLuckBonus, characters.helmetValue AS helmetValue, characters.helmetWeight AS helmetWeight, characters.helmetDefense AS helmetDefense, characters.armorTopName AS armorTopName, characters.armorTopEnum AS armorTopEnum, characters.armorTopAttackBonus AS armorTopAttackBonus, characters.armorTopDefenseBonus AS armorTopDefenseBonus, characters.armorTopAgilityBonus AS armorTopAgilityBonus, characters.armorTopIntelligenceBonus AS armorTopIntelligenceBonus, characters.armorTopLuckBonus AS armorTopLuckBonus, characters.armorTopValue AS armorTopValue, characters.armorTopWeight AS armorTopWeight, characters.armorTopDefense AS armorTopDefense, characters.armorBottomName AS armorBottomName, characters.armorBottomEnum AS armorBottomEnum, characters.armorBottomAttackBonus AS armorBottomAttackBonus, characters.armorBottomDefenseBonus AS armorBottomDefenseBonus, characters.armorBottomAgilityBonus AS armorBottomAgilityBonus, characters.armorBottomIntelligenceBonus AS armorBottomIntelligenceBonus, characters.armorBottomLuckBonus AS armorBottomLuckBonus, characters.armorBottomValue AS armorBottomValue, characters.armorBottomWeight AS armorBottomWeight, characters.armorBottomDefense AS armorBottomDefense, characters.attack AS attack, characters.defense AS defense, characters.agility AS agility, characters.intelligence AS intelligence, characters.luck AS luck, characters.level AS level, characters.experience AS experience, characters.gold AS gold, * from characters where id=" + slot + ";", [], function(tx, result)
    {
      try
      {
        var row = result.rows.item(0);
      }
      catch(e)
      {
        alertBox.Text = "Empty slot.";

        alertBox.Show();

        return;
      }

      hero.ID = row['id'];

      hero.Name = row['name'];
      hero.Gender = row['gender'];
      hero.Race = row['race'];
      hero.Class = row['class'];

      hero.HP = row['hp'];
      hero.MaxHP = row['maxHP'];
      hero.MP = row['mp'];
      hero.MaxMP = row['maxMP'];

      hero.Sword = new Weapon();
      hero.Shield = new Armor(ArmorType.shield);
      hero.Helmet = new Armor(ArmorType.helmet);
      hero.ArmorTop = new Armor(ArmorType.armorTop);
      hero.ArmorBottom = new Armor(ArmorType.armorBottom);

      hero.Sword.Name = row['swordName'];
      hero.Sword.WeaponEnum = row['swordEnum'];
      hero.Sword.AttackBonus = row['swordAttackBonus'];
      hero.Sword.DefenseBonus = row['swordDefenseBonus'];
      hero.Sword.AgilityBonus = row['swordAgilityBonus'];
      hero.Sword.IntelligenceBonus = row['swordIntelligenceBonus'];
      hero.Sword.LuckBonus = row['swordLuckBonus'];
      hero.Sword.Value = row['swordValue'];
      hero.Sword.Weight = row['swordWeight'];
      hero.Sword.Power = row['swordPower'];

      hero.Shield.Name = row['shieldName'];
      hero.Shield.WeaponEnum = row['shieldEnum'];
      hero.Shield.AttackBonus = row['shieldAttackBonus'];
      hero.Shield.DefenseBonus = row['shieldDefenseBonus'];
      hero.Shield.AgilityBonus = row['shieldAgilityBonus'];
      hero.Shield.IntelligenceBonus = row['shieldIntelligenceBonus'];
      hero.Shield.LuckBonus = row['shieldLuckBonus'];
      hero.Shield.Value = row['shieldValue'];
      hero.Shield.Weight = row['shieldWeight'];
      hero.Shield.Defense = row['shieldDefense'];

      hero.Helmet.Name = row['helmetName'];
      hero.Helmet.WeaponEnum = row['helmetEnum'];
      hero.Helmet.AttackBonus = row['helmetAttackBonus'];
      hero.Helmet.DefenseBonus = row['helmetDefenseBonus'];
      hero.Helmet.AgilityBonus = row['helmetAgilityBonus'];
      hero.Helmet.IntelligenceBonus = row['helmetIntelligenceBonus'];
      hero.Helmet.LuckBonus = row['helmetLuckBonus'];
      hero.Helmet.Value = row['helmetValue'];
      hero.Helmet.Weight = row['helmetWeight'];
      hero.Helmet.Defense = row['helmetDefense'];

      hero.ArmorTop.Name = row['armorTopName'];
      hero.ArmorTop.WeaponEnum = row['armorTopEnum'];
      hero.ArmorTop.AttackBonus = row['armorTopAttackBonus'];
      hero.ArmorTop.DefenseBonus = row['armorTopDefenseBonus'];
      hero.ArmorTop.AgilityBonus = row['armorTopAgilityBonus'];
      hero.ArmorTop.IntelligenceBonus = row['armorTopIntelligenceBonus'];
      hero.ArmorTop.LuckBonus = row['armorTopLuckBonus'];
      hero.ArmorTop.Value = row['armorTopValue'];
      hero.ArmorTop.Weight = row['armorTopWeight'];
      hero.ArmorTop.Defense = row['armorTopDefense'];

      hero.ArmorBottom.Name = row['armorBottomName'];
      hero.ArmorBottom.WeaponEnum = row['armorBottomEnum'];
      hero.ArmorBottom.AttackBonus = row['armorBottomAttackBonus'];
      hero.ArmorBottom.DefenseBonus = row['armorBottomDefenseBonus'];
      hero.ArmorBottom.AgilityBonus = row['armorBottomAgilityBonus'];
      hero.ArmorBottom.IntelligenceBonus = row['armorBottomIntelligenceBonus'];
      hero.ArmorBottom.LuckBonus = row['armorBottomLuckBonus'];
      hero.ArmorBottom.Value = row['armorBottomValue'];
      hero.ArmorBottom.Weight = row['armorBottomWeight'];
      hero.ArmorBottom.Defense = row['armorBottomDefense'];

      hero.Items = new ItemList();
      hero.Weapons = new ItemList();
      hero.Armor = new ItemList();
      hero.Spells = new ItemList();

      hero.Items.Load(tx, hero.ID, ItemType.item);
      hero.Weapons.Load(tx, hero.ID, ItemType.weapon);
      hero.Armor.Load(tx, hero.ID, ItemType.armor);
      hero.Spells.Load(tx, hero.ID, ItemType.spell);

      hero.Attack = row['attack'];
      hero.Defense = row['defense'];
      hero.Agility = row['agility'];
      hero.Intelligence = row['intelligence'];
      hero.Luck = row['luck'];

      hero.Level = row['level'];
      hero.Experience = row['experience'];
      hero.Gold = row['gold'];

      alertBox.Text = "Game loaded successfully.";

      alertBox.End = function()
      {
        SetAll(hero);

        menuVisible = false;

        $("#slotCover").hide();
        $("#menuCover").fadeOut();
      }

      alertBox.Show();
    }, function(tx, error){
      alertBox.Text = "Empty slot.";

      alertBox.Show();
    });
  }

  this.AttackEnemy = function(enemy)
  {
    var damage;
        var avg = ((this.Attack + this.Sword.Power + this.Sword.AttackBonus + this.Shield.AttackBonus + this.Helmet.AttackBonus +
            this.ArmorTop.AttackBonus + this.ArmorBottom.AttackBonus) / 7);
        var val = (avg + (.5) * (avg * avg) + 1);

        damage = Math.floor((Math.random() * val) + (val - (.5 * avg * avg)));

        if (damage < 0)
            damage = 0;

        if (enemy.HP <= damage)
            damage = -1;
        else
            enemy.HP -= damage;

        return damage;
  }

  this.GetDisplayItems = function()
  {
    var html = "";

    for(var i = 0; i < this.Items.ItemCount(); i++)
    {
      html += "<option value=\"" + this.Items.GetItemAt(i).ItemType + "," + this.Items.GetItemAt(i).EnumValue + "," + i + "\">" + this.Items.GetItemAt(i).Name + "</option>";
    }

    for(var i = 0; i < this.Weapons.ItemCount(); i++)
    {
      html += "<option value=\"" + this.Weapons.GetItemAt(i).ItemType + "," + this.Weapons.GetItemAt(i).WeaponEnum + "," + i + "\">" + this.Weapons.GetItemAt(i).Name + "</option>";
    }

    for(var i = 0; i < this.Armor.ItemCount(); i++)
    {
      html += "<option value=\"" + this.Armor.GetItemAt(i).ItemType + "," + this.Armor.GetItemAt(i).ArmorEnum + "," + i + "\">" + this.Armor.GetItemAt(i).Name + "</option>";
    }

    return html;
  }

  this.GetXPNeeded = function()
  {
    return 18 + Math.pow(2, this.Level);
  }
}

function Weapon()
{
  this.Name = "";
  this.WeaponEnum = WeaponEnum.none;
    this.ItemType = ItemType.weapon;
    this.AttackBonus = 0;
    this.DefenseBonus = 0;
    this.AgilityBonus = 0;
    this.IntelligenceBonus = 0;
    this.LuckBonus = 0;
    this.Value = 0;
    this.Weight = 0;
    this.Power = 0;

    this.Save = function(tx, index, charID)
    {
      tx.executeSql("INSERT into weapons (id, name, enum, attackBonus, defenseBonus, agilityBonus, intelligenceBonus, luckBonus, value, weight, power, characterID) VALUES (" + index + ", '" + this.Name + "', " + this.WeaponEnum + ", " + this.AttackBonus + ", " + this.DefenseBonus + ", " + this.AgilityBonus + ", " + this.IntelligenceBonus + ", " + this.LuckBonus + ", " + this.Value + ", " + this.Weight + ", " + this.Power + ", " + charID + ");", [], function(result){},
      function(tx, error){
        alert("Error in Weapon Save: " + error.message);
      });
    }
}

function Armor(type)
{
  this.Name = "";
  this.ArmorEnum = ArmorEnum.none;
    this.ItemType = ItemType.armor;
    this.AttackBonus = 0;
    this.DefenseBonus = 0;
    this.AgilityBonus = 0;
    this.IntelligenceBonus = 0;
    this.LuckBonus = 0;
    this.Value = 0;
    this.Weight = 0;
    this.ArmorType = type;
    this.Defense = 0;

    this.Save = function(tx, index, charID)
    {
      tx.executeSql("INSERT into armors (id, name, enum, attackBonus, defenseBonus, agilityBonus, intelligenceBonus, luckBonus, value, weight, armorType, defense, characterID) VALUES (" + index + ", '" + this.Name + "', " + this.ArmorEnum + ", " + this.AttackBonus + ", " + this.DefenseBonus + ", " + this.AgilityBonus + ", " + this.IntelligenceBonus + ", " + this.LuckBonus + ", " + this.Value + ", " + this.Weight + ", " + this.ArmorType + ", " + this.Defense + ", " + charID + ");", [], function(result){},
      function(tx, error){
        alert("Error in Armor Save: " + error.message);
      });
    }
}

function Item()
{
  this.Name = ItemNames.none;
  this.EnumValue = Items.none;
  this.ItemType = ItemType.item;
  this.Value = 0;
  this.Weight = 0;

    this.Save = function(tx, index, charID)
    {
      tx.executeSql("INSERT into items (id, name, enum, value, weight, characterID) VALUES (" + index + ", '" + this.Name + "', " + this.EnumValue + ", " + this.Value + ", " + this.Weight + ", " + charID + ");", [], function(result){},
      function(tx, error){
        alert("Error in Item Save: " + error.message);
      });
    }
}

function Spell()
{
  this.Name = "";
  this.Spell = Spells.heal;
  this.Cost = 0;

    this.Save = function(tx, index, charID)
    {
      tx.executeSql("INSERT into spells (id, name, spell, cost, characterID) VALUES (" + index + ", '" + this.Name + "', " + this.Spell + ", " + this.Cost + ", " + charID + ");", [], function(result){},
      function(tx, error){
        alert("Error in Spell Save: " + error.message);
      });
    }
}

function ItemResult()
{
  this.Index = 0;
  this.Item = Items.none;
  this.DestinationEntity = EntityDestination.hero;
  this.Destination = Destination.hp;
  this.Power = 0;
}

function Enemy()
{
  this.Name = "";
  this.HP = 0;
  this.MaxHP = 0;
  this.MP = 0;
  this.MaxMP = 0;
  this.Level = 1;
  this.MaxGold = 0;
  this.MaxXP = 0;

  this.Attack = function(char, isDefending)
  {
    var damage;
        var val = (((isDefending ? 1 : 2) * this.Level) + char.Sword.DefenseBonus + char.Shield.DefenseBonus +
            char.Helmet.DefenseBonus + char.ArmorTop.DefenseBonus + char.ArmorBottom.DefenseBonus) / 2;

        damage = Math.floor((Math.random() * val) + (val - Math.random() * char.Luck));

        if (damage < 0)
            damage = 0;

        if (char.HP <= damage)
            return -1;
        else
            char.HP -= damage;

        return damage;
  }

  this.GetXP = function()
  {
    return Math.floor((Math.random() * this.MaxXP) + 1);
  }

  this.GetGold = function()
  {
    return Math.floor((Math.random() * this.MaxGold) + 1);
  }
}

function ItemList()
{
  this.items = new Array();

  this.ItemCount = function()
  {
    return this.items.length;
  }

  this.AddItem = function(item)
  {
    this.items.push(item);
  }

  this.GetItemAt = function(index)
  {
    return this.items[index];
  }

  this.RemoveItemAt = function(index)
  {
    var temp = this.items;

    for(var i = index; i < this.items.length - 1; i++)
    {
      temp[i] = temp[i + 1];
    }

    var temp2 = new Array();

    for(i = 0; i < this.items.length - 1; i++)
    {
      temp2.push(temp[i]);
    }

    this.items = temp2;
  }

  this.Save = function(tx, charID, type)
  {
    switch(type)
    {
      case ItemType.item:
        tx.executeSql("DELETE FROM items where characterID=" + charID + ";", [],function(tx, result){},function(tx, error){alert("Error in item delete: " + error.message);});

        break;

      case ItemType.weapon:
        tx.executeSql("DELETE FROM weapons where characterID=" + charID + ";", [], function(tx, result){},function(tx, error){alert("Error in weapon delete: " + error.message);});

        break;

      case ItemType.armor:
        tx.executeSql("DELETE FROM armors where characterID=" + charID + ";", [], function(tx, result){},function(tx, error){alert("Error in armor delete: " + error.message);});

        break;

      case ItemType.spell:
        tx.executeSql("DELETE FROM spells where characterID=" + charID + ";", [], function(tx, result){},function(tx, error){alert("Error in spell delete: " + error.message);});

        break;
    }

    for(var i = 0; i < this.items.length; i++)
    {
      this.items[i].Save(tx, i, charID);
    }
  }

  this.Load = function(tx, charID, type)
  {
    var self = this;

    switch(type)
    {
      case ItemType.item:
        tx.executeSql("SELECT items.name AS name, items.enum AS enum, items.value AS value, items.weight AS weight, * from items where characterID=" + charID + ";", [], function(tx, result)
        {
          for(var i = 0; i < result.rows.length; i++)
          {
            var row = result.rows.item(i);

            var temp = new Item();

            temp.Name = row['name'];
            temp.EnumValue = row['enum'];
            temp.Value = row['value'];
            temp.Weight = row['weight'];

            self.AddItem(temp);
          }
        },
        function(tx, error)
        {
          alert("Error in Item Load: " + error.message);
        });

        break;

      case ItemType.weapon:
        tx.executeSql("SELECT weapons.name AS name, weapons.enum AS weaponEnum, weapons.attackBonus AS attackBonus, weapons.defenseBonus AS defenseBonus, weapons.agilityBonus AS agilityBonus, weapons.intelligenceBonus AS intelligenceBonus, weapons.luckBonus AS luckBonus, weapons.value AS value, weapons.weight AS weight, weapons.power AS power, * from weapons where characterID=" + charID + ";", [], function(tx, result)
        {
          for(var i = 0; i < result.rows.length; i++)
          {
            var row = result.rows.item(i);

            var temp = new Weapon();

            temp.Name = row['name'];
            temp.WeaponEnum = row['weaponEnum'];
            temp.AttackBonus = row['attackBonus'];
            temp.DefenseBonus = row['defenseBonus'];
            temp.AgilityBonus = row['agilityBonus'];
            temp.IntelligenceBonus = row['intelligenceBonus'];
            temp.LuckBonus = row['luckBonus'];
            temp.Value = row['value'];
            temp.Weight = row['weight'];
            temp.Power = row['power'];

            self.AddItem(temp);
          }
        },
        function(tx, error)
        {
          alert("Error in Weapon Load: " + error.message);
        });

        break;

      case ItemType.armor:
        tx.executeSql("SELECT armors.name AS name, armors.enum AS armorEnum, armors.attackBonus AS attackBonus, armors.defenseBonus AS defenseBonus, armors.agilityBonus AS agilityBonus, armors.intelligenceBonus AS intelligenceBonus, armors.luckBonus AS luckBonus, armors.value AS value, armors.weight AS weight, armors.armorType AS armorType, armors.defense AS defense, * from armors where characterID=" + charID + ";", [], function(tx, result)
        {
          for(var i = 0; i < result.rows.length; i++)
          {
            var row = result.rows.item(i);

            var temp = new Armor();

            temp.Name = row['name'];
            temp.ArmorEnum = row['armorEnum'];
            temp.AttackBonus = row['attackBonus'];
            temp.DefenseBonus = row['defenseBonus'];
            temp.AgilityBonus = row['agilityBonus'];
            temp.IntelligenceBonus = row['intelligenceBonus'];
            temp.LuckBonus = row['luckBonus'];
            temp.Value = row['value'];
            temp.Weight = row['weight'];
            temp.Defense = row['defense'];

            self.AddItem(temp);
          }
        },
        function(tx, error)
        {
          alert("Error in Armor Load: " + error.message);
        });

        break;

      case ItemType.spell:
        tx.executeSql("SELECT spells.name AS name, spells.spell AS spell, spells.cost AS cost, * from spells where characterID=" + charID + ";", [], function(tx, result)
        {
          for(var i = 0; i < result.rows.length; i++)
          {
            var row = result.rows.item(i);

            var temp = new Spell();

            temp.Name = row['name'];
            temp.Spell = row['spell'];
            temp.Cost = row['cost'];

            self.AddItem(temp);
          }
        }, function(tx, error)
        {
          alert("Error in Spell Load: " + error.message);
        });

        break;
    }
  }
}

/* Maps */

var map = new Array(new Array(new Array(new Array(0, 12, 12, 13, 14, 13, 15, 16, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2, 2, 0, 4),
                    new Array(0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 2, 2, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10)),

                new Array(new Array(3, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6))),

          new Array(new Array(new Array(5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 2, 2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 2, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4),
                    new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4)),

                new Array(new Array(7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                    new Array(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))));

/* Presenters */

function Battle(char, enemy)
{
  this.Char = char;
  this.Enemy = enemy;

  this.UpdateInfo = function()
  {
    $("#enemyName").html("Name: " + this.Enemy.Name);
    $("#enemyHP").html("HP: " + this.Enemy.HP);

    $("#heroName").html("Name: " + this.Char.Name);
    $("#heroHP").html("HP: " + this.Char.HP);
    $("#heroMP").html("MP: " + this.Char.MP);
  }

  this.Attack = function(defending)
  {
    if(!defending)
    {
      var damage = this.Char.AttackEnemy(this.Enemy);

      if(damage == -1)
      {
        this.Enemy.HP = 0;

        var xp = this.Enemy.GetXP();
        var gold = this.Enemy.GetGold();

        this.Char.Experience += xp;
        this.Char.Gold += gold;

        this.UpdateInfo();

        $("#battleInfo").html("You defeated the " + this.Enemy.Name + "!<br />You gained " + xp + " experience point" + ((xp > 1) ? "s" : "") + " and " + gold + " gold.");

        if(this.Char.Experience >= this.Char.GetXPNeeded())
        {
          this.Char.Attack += Math.floor(Math.random() * 5 + 1);
          this.Char.Defense += Math.floor(Math.random() * 5 + 1);
          this.Char.Agility += Math.floor(Math.random() * 5 + 1);
          this.Char.Intelligence += Math.floor(Math.random() * 5 + 1);
          this.Char.Luck += Math.floor(Math.random() * 5 + 1);

          this.Char.MaxHP += 10;
          this.Char.HP = this.Char.MaxHP;
          this.Char.MaxMP += 10;
          this.Char.MP = this.Char.MaxMP;

          this.Char.Level++;

          $("#battleInfo").html($("#battleInfo").html() + "<br />You gained a level!  You are now level " + this.Char.Level);
        }

        this.Char.InBattle = false;

        $("#battleInfo").stopTime();

        var char = this.Char

        $("#battleInfo").oneTime(2000, "win", function(){
          $("#battleInfo").html("");

          char.InBattle = false;

          SetAll(char);

          $("#cover").fadeOut();

          return;
        });

        return;
      }
      else
        $("#battleInfo").html("You did " + damage + " damage.");

      this.UpdateInfo();
    }
    else
      $("#battleInfo").html("You parry.");

    this.EnemyAttack();
  }

  this.Item = function()
  {
    if(document.getElementById("battleItems").value == "")
      return;

    var itemSuccess = false;

    var vals = document.getElementById("battleItems").value.split(",");
    var itemType = parseInt(vals[0]);
    var item = parseInt(vals[1]);
    var index = parseInt(vals[2]);
    var result;

    switch(itemType)
    {
      case ItemType.item:
        switch(item)
        {
          case Items.potion:
            var result = new ItemResult();

            result.Index = index;
            result.Item = Items.potion;
            result.DestinationEntity = EntityDestination.hero;
            result.Destination = Destination.hp;
            result.Power = 10;

            itemSuccess = this.BattleHealingItem(result);

            break;

          case Items.ether:
            var result = new ItemResult();

            result.Index = index;
            result.Item = Items.ether;
            result.DestinationEntity = EntityDestination.hero;
            result.Destination = Destination.mp;
            result.Power = 10;

            itemSuccess = this.BattleHealingItem(result);

            break;

          default:
            $("#battleInfo").html("This item cannot be used in battle.");

            $("#itemsCover").fadeOut();

            $("#battleInfo").stopTime();

            $("#battleInfo").oneTime(1000, "clear", function(){
              $("#battleInfo").html("");
            });

            break;
        }

        break;

      case ItemType.weapon:
        switch(item)
        {
        }

        break;

      case ItemType.armor:
        switch(item)
        {
        }

        break;
    }

    if(itemSuccess)
    {
      this.EnemyAttack();
    }
  }

  this.Run = function(char)
  {
    if(Math.floor(Math.random() * 2) == 1)
    {
      $("#battleInfo").html("You got away safely!");

      this.Char.InBattle = false;

      $("#battleInfo").stopTime();

      $("#battleRun").oneTime(1000, "run", function(){
        $("#battleInfo").html("");

        char.InBattle = false;

        SetAll(char);

        $("#cover").fadeOut();
      });
    }
    else
    {
      $("#battleInfo").html("Your escape route was cut off.");

      $("#battleInfo").stopTime();

      $("#battleInfo").oneTime(1000, "run", function(){
        $("#battleInfo").html("");
      });

      this.EnemyAttack();

      this.UpdateInfo();
    }
  }

  this.EnemyAttack = function()
  {
    damage = this.Enemy.Attack(this.Char);

    if(damage == -1)
    {
      $("#battleInfo").html("You were defeated!");

      $("#battleInfo").html("");

      this.Char.InBattle = false;

      SetAll(this.Char);

      $("#cover").fadeOut();

      world.heroX = 0;
      world.heroY = 0;
      world.curMapX = 0;
      world.curMapY = 0;

      world.Translate();
      world.Draw();

      return;
    }
    else
      $("#battleInfo").html($("#battleInfo").html() + "<br />The " + this.Enemy.Name + " did " + damage + " damage.");

    $("#battleInfo").stopTime();

    $("#battleInfo").oneTime(1000, "run", function(){
      $("#battleInfo").html("");
    });

    this.UpdateInfo();
  }

  this.BattleHealingItem = function(result)
  {
    var dest = "";
    var destEntity = "";

    switch(result.Destination)
    {
      case Destination.hp:
        dest = "HP";

        break;

      case Destination.mp:
        dest = "MP";

        break;
    }

    switch(result.DestinationEntity)
    {
      case EntityDestination.hero:
        destEntity = "world.battle.Char";

        break;

      case EntityDestination.enemy:
        destEntity = "world.battle.Enemy";

        break;
    }

    if(eval(destEntity + ".Max" + dest + " - " + destEntity + "." + dest + " > result.Power"))
    {
      eval(destEntity + "." + dest + " += result.Power");

      $("#itemsCover").fadeOut();

      $("#battleInfo").html(result.Power + " " + dest + " recovered.");

      this.Char.Items.RemoveItemAt(result.Index);

      return true;
    }
    else if(eval(destEntity + "." + dest + " == " + destEntity + ".Max" + dest))
    {
      $("#itemsCover").fadeOut();

      $("#battleInfo").html(dest + " is already full!");

      return false;
    }
    else
    {
      $("#battleInfo").html(eval(destEntity + ".Max" + dest + " - " + destEntity + "." + dest) + " " + dest + " recovered.");

      eval(destEntity + "." + dest + " = " + destEntity + ".Max" + dest);

      $("#itemsCover").fadeOut();

      this.Char.Items.RemoveItemAt(result.Index);

      return true;
    }
  }
}

function Inn(text, char)
{
  this.Text = text;
  this.Char = char;

  this.Show = function()
  {
    $("#innText").html(this.Text);

    pause = true;

    $("#inn").css({"top" : $(window).height() / 2 - 150 / 2, "left" : $(window).width() / 2 - 150 / 2});

    $("#innCover").fadeIn();
  }

  this.Stay = function()
  {
    var gold = this.Char.Gold;

    if(gold < 10)
    {
      alertBox.Text = "Not enough gold to stay.";
      alertBox.Show();
    }
    else
    {
      alertBox.Text = "Have a good rest!";
      alertBox.End = function()
      {
        world.inn.Char.Gold -= 10;
        world.inn.Char.HP = world.inn.Char.MaxHP;
        world.inn.Char.MP = world.inn.Char.MaxMP;

        SetAll(world.inn.Char);

        pause = false;

        $("#innCover").fadeOut();
      }
      alertBox.Show();
    }
  }

  this.Leave = function()
  {
    pause = false;

    $("#innCover").fadeOut();
  }
}

function ConfirmationBox(question)
{
  this.Result;
  this.Question = question;
  this.Data;
  this.End = function(){};

  this.Show = function()
  {
    pause = true;

    $("#confirmationBox").css({"top" : $(window).height() / 2 - $("#confirmationBox").height() / 2, "left" : $(window).width() / 2 - $("#confirmationBox").width() / 2});

    $("#confirmQuestion").html(this.Question);

    $("#confirmationBox").show();
  }

  this.Hide = function()
  {
    pause = false;

    $("#confirmationBox").hide();

    this.End(this.Result);
  }
}

function AlertBox(text)
{
  this.Text = text;
  this.Visible = false;
  this.End = function(){}

  this.Show = function()
  {
    pause = true;
    this.Visible = true;

    $("#alertBox").css({"top" : $(window).height() / 2 - $("#alertBox").height() / 2, "left" : $(window).width() / 2 - $("#alertBox").width() / 2});

    $("#alertText").html(this.Text);

    $("#alertBox").show();
  }

  this.Hide = function()
  {
    pause = false;
    this.Visible = false;

    $("#alertBox").hide();

    this.End();
  }
}

// Interface Presenters

function SetEquipment(char)
{
  $("#equipment").html("<span>Weapon: " + char.Sword.Name + "</span><br /><span>Shield: " + char.Shield.Name + "</span><br /><span>Helmet: " + char.Helmet.Name + "</span><br /><span>Armor Top: " + char.ArmorTop.Name + "</span><br /><span>Armor Bottom: " + char.ArmorBottom.Name + "</span><br /><br /><span>Attack Bonus: " + (char.Sword.AttackBonus + char.Shield.AttackBonus + char.Helmet.AttackBonus + char.ArmorTop.AttackBonus + char.ArmorBottom.AttackBonus) + "</span><br /><span>Defense Bonus: " + (char.Sword.DefenseBonus + char.Shield.DefenseBonus + char.Helmet.DefenseBonus + char.ArmorTop.DefenseBonus + char.ArmorBottom.DefenseBonus) + "</span><br /><span>Agility Bonus: " + (char.Sword.AgilityBonus + char.Shield.AgilityBonus + char.Helmet.AgilityBonus + char.ArmorTop.AgilityBonus + char.ArmorBottom.AgilityBonus) + "</span><br /><span>Intelligence Bonus: " + (char.Sword.IntelligenceBonus + char.Shield.IntelligenceBonus + char.Helmet.IntelligenceBonus + char.ArmorTop.IntelligenceBonus + char.ArmorBottom.IntelligenceBonus) + "</span><br /><span>Luck Bonus: " + (char.Sword.LuckBonus + char.Shield.LuckBonus + char.Helmet.LuckBonus + char.ArmorTop.LuckBonus + char.ArmorBottom.LuckBonus) + "</span>");
}

function SetItems(char)
{
  $("#items").html(char.GetDisplayItems());
}

function SetStats(char)
{
  $("#stats").html("<span>" + char.Name + "</span><br /><span>Race: " + RaceNames[char.Race] + "</span><br /><span>Class: " + ClassNames[char.Class] + "</span><br /><span>HP: " + char.HP + "/" + char.MaxHP + "</span><br /><span>MP: " + char.MP + "/" + char.MaxMP + "</span><br /><span>Attack: " + char.Attack + "</span><br /><span>Defense: " + char.Defense + "</span><br /><span>Agility: " + char.Agility + "</span><br /><span>Intelligence: " + char.Intelligence + "</span><br /><span>Luck: " + char.Luck + "</span><br /><br /><span>Level: " + char.Level + "</span><br /><span>Experience: " + char.Experience + "</span><br /><span>Gold: " + char.Gold + "</span>");
}

function SetAll(char)
{
  SetEquipment(char);
  SetItems(char);
  SetStats(char);
}

// World Presenters

function World(tempHero)
{
  this.heroX = 0;
  this.heroY = 0;
  this.curMapX = 0;
  this.curMapY = 0;
  this.ctx = document.getElementById("graphic").getContext("2d");
  this.ctxBuf = document.getElementById("graphicBuffer").getContext("2d");
  this.hero = tempHero;
  this.stepCtr = 0;
  this.noBattle = false;
  this.battleNum = Math.floor((Math.random() * 10) + 5);
  this.battle = new Battle(this.hero, new Enemy());
  this.inn = new Inn("", this.hero);

  this.images = new Array(new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()),
              new Array(new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()));

  this.ToggleNoBattle = function()
  {
    this.noBattle = (this.noBattle ? false : true);
  }

  this.Move = function(direction)
  {
    var moved = false;

    switch(direction)
    {
      case Directions.up:
        if(this.images[this.heroY][this.heroX].isTransitionUp)
        {
          moved = true;

          this.heroY = 19;
          this.curMapY--;

          this.Translate();
          this.Draw();
        }
        else if(this.heroY > 0 && this.images[this.heroY - 1][this.heroX].walkable)
        {
          moved = true;

          this.heroY--;
        }

        break;

      case Directions.down:
        if(this.images[this.heroY][this.heroX].isTransitionDown)
        {
          moved = true;

          this.heroY = 0;
          this.curMapY++;

          this.Translate();
          this.Draw();
        }
        else if(this.heroY < 19 && this.images[this.heroY + 1][this.heroX].walkable)
        {
          moved = true;

          this.heroY++;
        }

        break;

      case Directions.left:
        if(this.images[this.heroY][this.heroX].isTransitionLeft)
        {
          moved = true;

          this.heroX = 19;
          this.curMapX--;

          this.Translate();
          this.Draw();
        }
        else if(this.heroX > 0 && this.images[this.heroY][this.heroX - 1].walkable)
        {
          moved = true;

          this.heroX--;
        }

        break;

      case Directions.right:
        if(this.images[this.heroY][this.heroX].isTransitionRight)
        {
          moved = true;

          this.heroX = 0;
          this.curMapX++;

          this.Translate();
          this.Draw();
        }
        else if(this.heroX < 19 && this.images[this.heroY][this.heroX + 1].walkable)
        {
          moved = true;

          this.heroX++;
        }

        break;
    }

    if(moved)
    {
      if(this.images[this.heroY][this.heroX].isWild)
      {
        if(!this.noBattle)
          this.stepCtr++;

        if(this.stepCtr == this.battleNum)
        {
          this.stepCtr = 0;
          this.battleNum = Math.floor((Math.random() * 10) + 5);

          var enemy = new Enemy();

          enemy.Name = "Wild Boar";
          enemy.HP = 25;
          enemy.MaxHP = 25;
          enemy.MP = 25;
          enemy.MaxMP = 25;
          enemy.Level = 1;
          enemy.MaxGold = 5;
          enemy.MaxXP = 5;

          this.battle = new Battle(this.hero, enemy);

          this.battle.UpdateInfo();

          this.hero.InBattle = true;

          $("#battleBox").css({"top" : $(window).height() / 2 - 250 / 2, "left" : $(window).width() / 2 - 250 / 2});

          $("#cover").fadeIn();
        }
      }

      if(this.images[this.heroY][this.heroX].tile == Tiles.inn)
      {
        this.inn = new Inn("Welcome to the Cieldeth inn!<br />It's 10 gold a night to stay.", this.hero);

        this.inn.Show();
      }

      if(this.images[this.heroY][this.heroX].isItem)
      {
        switch(this.images[this.heroY][this.heroX].itemType)
        {
          case Items.potion:
            var temp = new Item();

            temp.Name = ItemNames.potion;
            temp.EnumValue = Items.potion;
            temp.Value = 5;
            temp.Weight = 0;

            this.hero.Items.AddItem(temp);

            $("#info").html("<span>You picked up a potion!");

            $("#info").stopTime();

            $("#info").oneTime(2000, "once", function(){
              $("#info").html("");
            });

            break;

          case Items.ether:
            var temp = new Item();

            temp.Name = ItemNames.ether;
            temp.EnumValue = Items.ether;
            temp.Value = 5;
            temp.Weight = 0;

            this.hero.Items.AddItem(temp);

            $("#info").html("<span>You picked up an ether!");

            $("#info").stopTime();

            $("#info").oneTime(2000, "once", function(){
              $("#info").html("");
            });

            break;

          case Items.warp:
            var temp = new Item();

            temp.Name = ItemNames.warp;
            temp.EnumValue = Items.warp;
            temp.Value = 10;
            temp.Weight = 1;

            this.hero.Items.AddItem(temp);

            $("#info").html("<span>You picked up a warp!");

            $("#info").stopTime();

            $("#info").oneTime(2000, "once", function(){
              $("#info").html("");
            });

            break;
        }

        map[this.curMapY][this.curMapX][this.heroY][this.heroX] = 0;

        this.Translate();
        this.Draw();

        SetItems(this.hero);
      }

      this.Redraw();
    }
  }

  this.Draw = function()
  {
    for(var i = 0; i < 20; i++)
    {
      for(var j = 0; j < 20; j++)
      {
        this.DrawTile(this.images[j][i].tile, 20 * i, 20 * j);
      }
    }

    this.DrawTile(Tiles.hero, 20 * this.heroX, 20 * this.heroY);
  }

  this.Redraw = function()
  {
    var currentPixels = this.ctx.getImageData(0, 0, 400, 400);
    this.ctxBuf.putImageData(currentPixels, 0, 0);

    this.ctx.clearRect(this.heroX * 20, this.heroY * 20, 20, 20);
    this.DrawTile(this.images[this.heroY][this.heroX].tile, 20 * this.heroX, 20 * this.heroY);

    if(this.heroX != 0)
    {
      this.ctx.clearRect((this.heroX - 1) * 20, this.heroY * 20, 20, 20);
      this.DrawTile(this.images[this.heroY][this.heroX - 1].tile, 20 * (this.heroX - 1), 20 * this.heroY);
    }

    if(this.heroX != 19)
    {
      this.ctx.clearRect((this.heroX + 1) * 20, this.heroY * 20, 20, 20);
      this.DrawTile(this.images[this.heroY][this.heroX + 1].tile, 20 * (this.heroX + 1), 20 * this.heroY);
    }

    if(this.heroY != 0)
    {
      this.ctx.clearRect(this.heroX * 20, (this.heroY - 1) * 20, 20, 20);
      this.DrawTile(this.images[this.heroY - 1][this.heroX].tile, 20 * this.heroX, 20 * (this.heroY - 1));
    }

    if(this.heroY != 19)
    {
      this.ctx.clearRect(this.heroX * 20, (this.heroY + 1) * 20, 20, 20);
      this.DrawTile(this.images[this.heroY + 1][this.heroX].tile, 20 * this.heroX, 20 * (this.heroY + 1));
    }

    this.DrawTile(Tiles.hero, 20 * this.heroX, 20 * this.heroY);
  }

  this.Translate = function()
  {
    for(var i = 0; i < 20; i++)
    {
      for(var j = 0; j < 20; j++)
      {
        switch(map[this.curMapY][this.curMapX][i][j])
        {
          case 0:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 1:
            this.images[i][j].tile = Tiles.water;
            this.images[i][j].walkable = false;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = false;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 2:
            this.images[i][j].tile = Tiles.shallowWater;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 3:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = true;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 4:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = true;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 5:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = true;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 6:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = true;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 7:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = true;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = true;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 8:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = true;
            this.images[i][j].isTransitionUp = true;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 9:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = true;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = true;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 10:
            this.images[i][j].tile = Tiles.grass;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = true;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = true;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = false;
            this.images[i][j].itemType = Items.none;

            break;

          case 12:
            this.images[i][j].tile = Tiles.potion;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = true;
            this.images[i][j].itemType = Items.potion;

            break;

          case 13:
            this.images[i][j].tile = Tiles.ether;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = true;
            this.images[i][j].itemType = Items.ether;

            break;

          case 14:
            this.images[i][j].tile = Tiles.warp;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = true;
            this.images[i][j].isItem = true;
            this.images[i][j].itemType = Items.warp;

            break;

          case 15:
            this.images[i][j].tile = Tiles.treeBottomLeft;
            this.images[i][j].walkable = false;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = false;
            this.images[i][j].isItem = false;

            break;

          case 16:
            this.images[i][j].tile = Tiles.treeBottomRight;
            this.images[i][j].walkable = false;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = false;
            this.images[i][j].isItem = false;

            break;

          case 17:
            this.images[i][j].tile = Tiles.inn;
            this.images[i][j].walkable = true;
            this.images[i][j].isTransitionLeft = false;
            this.images[i][j].isTransitionRight = false;
            this.images[i][j].isTransitionUp = false;
            this.images[i][j].isTransitionDown = false;
            this.images[i][j].isWild = false;
            this.images[i][j].isItem = false;

            break;
        }
      }
    }
  }

  this.DrawTile = function(tile, x, y)
  {
    switch(tile)
    {
      case Tiles.grass:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);

        break;

      case Tiles.water:
        this.ctx.fillStyle = "rgb(20, 20, 200)";
        this.ctx.fillRect(x, y, 20, 20);

        break;

      case Tiles.shallowWater:
        this.ctx.fillStyle = "rgb(80, 100, 200)";
        this.ctx.fillRect(x, y, 20, 20);

        break;

      case Tiles.potion:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);
        this.ctx.fillStyle = "rgb(200, 0, 200)";
        this.ctx.fillRect(x + 5, y + 5, 10, 10);

        break;

      case Tiles.ether:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);
        this.ctx.fillStyle = "rgb(20, 100, 200)";
        this.ctx.fillRect(x + 5, y + 5, 10, 10);

        break;

      case Tiles.warp:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);
        this.ctx.fillStyle = "rgb(200, 200, 200)";
        this.ctx.fillRect(x + 5, y + 5, 10, 10);

        break;

      case Tiles.treeBottomLeft:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);
        this.ctx.fillStyle = "rgb(35, 146, 39)";
        this.ctx.beginPath();
        this.ctx.arc(x + 20, y, 20, Math.PI, 3 * Math.PI / 2, true);
        this.ctx.closePath();
        this.ctx.fill();

        break;

      case Tiles.treeBottomRight:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);
        this.ctx.fillStyle = "rgb(35, 146, 39)";
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 3 * Math.PI / 2, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.fill();

        break;

      case Tiles.inn:
        this.ctx.fillStyle = "rgb(20, 200, 20)";
        this.ctx.fillRect(x, y, 20, 20);
        this.ctx.fillStyle = "rgb(136, 101, 12)";
        this.ctx.fillRect(x + 2, y + 2, 16, 16);

        break;

      case Tiles.hero:
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();

        break;
    }
  }

  this.Save = function(tx, slot)
  {
    tx.executeSql("DELETE from worldData where characterID=" + slot + ";", []);
    tx.executeSql("INSERT into worldData (heroX, heroY, curMapX, curMapY, characterID) VALUES (" + this.heroX + ", " + this.heroY + ", " + this.curMapX + ", " + this.curMapY + ", " + slot + ");", []);
  }

  this.Load = function(tx, tempWorld, slot)
  {
    var world = tempWorld;

    tx.executeSql("SELECT worldData.heroX AS heroX, worldData.heroY AS heroY, worldData.curMapX AS curMapX, worldData.curMapY AS curMapY, * from worldData where characterID=" + slot + ";", [],
    function(tx, result)
    {
      var row = result.rows.item(0);

      world.heroX = row['heroX'];
      world.heroY = row['heroY'];
      world.curMapX = row['curMapX'];
      world.curMapY = row['curMapY'];

      world.Translate();
      world.Draw();
    },
    function(tx, error)
    {
      alert("Error loading world data (" + error.message + ").");
    });
  }
}
