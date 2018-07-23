# Generate tileset.json from ぴぽや倉庫

## Credit

- [ぴぽや](http://blog.pipoya.net/)

## setting.csv

> row key key key key key key key key
> row key key ...

### keys

| key | enum    | auto layer | collider |
| --- | ------- | ---------- | -------- |
| N   | Nope    | -          | -        |
| G   | Ground  | 2          | false    |
| W   | Wall    | 1          | true     |
| R   | Road    | 1          | false    |
| U   | Rug     | 1          | inherit  |
| B   | Barrier | 1          | true     |
| F   | Float   | 0          | inherit  |
| S   | Sky     | 0          | inherit  |
