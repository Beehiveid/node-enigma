### RESTful API Doc

| No | Verb | Path | Action | Implemented? |
|----|------|------|--------|--------------|
| 1. |  GET | /bills| INDEX  | Yes |
| 2. |  GET | /bills/create| CREATE  | No | 
| 3. |  POST | /bills| STORE  | No |
| 4. |  GET | /bills/{userID} | SHOW  | Yes |
| 5. |  GET | /bills/{billID}/edit| EDIT  | No |
| 6. |  PUT | /bills/{billID}| UPDATE  | No |
| 7. |  DELETE | /bills/{billID}| DELETE  | No |
| 7. |  POST | /bills/paybills | PAY  | Yes |
| 4. |  GET | /bills/{userID}/9 | QUEUED BILLS  | Yes |