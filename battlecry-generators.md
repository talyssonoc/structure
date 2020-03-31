# Battlecry generators

There are configurable [BattleCry](https://github.com/pedsmoreira/battlecry) generators ready to be downloaded and help scaffolding schema:

```bash
npm install -g battlecry
cry download generator talyssonoc/structure
cry g schema user name age:int:required cars:string[] favoriteBook:book friends:user[]:default :updateAge
```

Run `cry --help` to check more info about the generators available;

