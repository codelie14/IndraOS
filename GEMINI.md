## Error Type
Runtime ReferenceError

## Error Message
display_name is not defined


    at eval (app\services\page.tsx:94:5)
    at Array.filter (<anonymous>:null:null)
    at ServicesPage (app\services\page.tsx:92:37)

## Code Frame
  92 |   const filteredServices = services.filter(service => 
  93 |     service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
> 94 |     display_name.toLowerCase().includes(searchTerm.toLowerCase())
     |     ^
  95 |   );
  96 |
  97 |   const getStatusColor = (status: string) => {

Next.js version: 15.5.2 (Webpack)
