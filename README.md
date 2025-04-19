## Setup & Running

Both the front end and back end are containerized and a docker compose file is provided. To run the
solution, simply run `docker compose up` from the root directory. The app will be running at
http://localhost:9000

If you would like to generate and view the Prisma & GraphQL clients used by the backend, run the following:

```
cd backend
yarn
yarn prisma-gen
```

## Tech Choices

### Front End

**Vite**  
Vite was chosen as the bundler because it's very easy to setup due to its opinionated take on
bundling. It also supports using SWC (a Rust based transpiler/tree-shaker/minifier/etc.)
out-of-the-box, which is _very_ fast.

**Observable Plots**  
The Observable Plots library is a wrapper around D3.js created by the creators of D3. It applies a
lot of opinionated, default values when generating D3 plots, which makes it a lot easier and faster
to get decent looking plots. It still offers a lot of extensibility, though. Since anything that can be generated through this library can
be generated through D3 directly, it is easy to replace if the limitations ever become too much.

**Styled Components**  
Styled components is a CSS-in-JS library. I personally believe that styles should exist next to
(preferably in) the components that use them. Styled components still offers theming and
re-usability of shared styles, though I believe the latter should be implemented through a component
library rather than shared classes.

**Apollo Client**  
Apollo is a GraphQL client with built-in caching, typescript support, and can utilize Reacts new
concurrent rendering engine. The last point means that React's Suspense components will display the
provided fallback until the query returns. It also means that a lot of the normal state management
of async requests is no longer needed, as the component will pause rendering until the request
returns. Examples of this can be seen in the individual plot components (e.g. RecordByTeam) and the
usage of Suspense in the PlotWrapper component.

### Backend

**Prisma**  
I chose to use an ORM as time was limited and it allowed me to quickly get a datastore up and
running. Prisma is an ORM that can manage database schema using its own schema definition language
and
automate migrations. This schema language also provides a method for automatically generating a
database client as well as APIs,
which will be discussed more below. Utilizing an ORM, I was able to build this PoC against a SQLite
database, but it could be easily migrated to Postgres with a few lines of code.

**TypeGraphQL**  
TypeGraphQL was used to generate GraphQL resolvers and a schema. Utilizing the schema that I wrote
for Prisma and a few lines of code, I was able to auto-generate a GraphQL server that worked well
enough for this PoC. However, this is a piece that I would most likely replace pretty quickly
because it generates a lot of unused resolvers and was missing some basic groupings that I had to
perform on the client side in order to display the data correctly. Additionally, the library that
generates the TypeGraphQL definitions from the Prisma definitions is still a work in progress and
probably not yet fit for production use.

**Apollo Server**  
Apollo Server is just a common GraphQL server. It offers an easy way to define resolvers and fetch
data from different sources. I chose GraphQL because it's an excellent tool to use when fetching
data from multiple sources. In this PoC, only a single database was used, but for an analytics
platform its highly likely that data would exist in disparate systems.

## Testing

Most of this solution is auto-generated and taped together, so there wasn't a large opportunity for
testing. On the front end, I did extract some logic that was being used to transform a couple of
query results in order to plot the data correctly. I added unit tests for those methods. On the back
end, I literally didn't have to add any additional logic to get the API working. So there's no unit
tests. However, I did add some integration tests that test the results of the specific GraphQL
queries that are being used on the front end. All tests were performed using Jest.

## Infrastructure and Scaling

I did not have time to try and get this deployed to AWS. Simply setting up a new AWS account and
writing IaC for all of the additional resources that would be required (VPCs, NAT
gateways, proper ACLs, IAM roles, etc) would have taken hours alone. However, both the frontend and
backend are containerized and would be able to be deployed into an AWS environment without any issues. As mentioned above, it would only take a few lines of code to change the
database target to something like an RDS instance. The frontend is static and is using a basic nginx
container to serve it. In a production setting, pushing the static files to S3 and then placing
Cloudfront in front of that would be more than enough.

> Scaling considerations for handling millions of rows of data

This is pretty vague, but there's several different ways this could scale dependent on the access
patterns of the data.

First, relational data that is required to be consistent should be stored in a relational database
with efficient transaction handling. The easiest way to scale this type of database is through
read-replicas. Utilizing a single instance as your source of truth, data can be replicated to many
other instances that are queried against. However, this results in only a single instance that can
handle writes and it may not scale well enough for very write-heavy access patterns. If that's the
case, the only other option is sharding. This is when data is partitioned across many instances. How
data is partitioned is specific to the data and the implementation. Sharding can distribute both
read and write workloads across a cluster, but introduces _a lot_ of complexity. Whether or not data
requires the consistency guarantees from a relational database should be heavily scrutinized before
deciding that sharding is the correct approach.

Non-relational databases are a great choice for pushing a lot of data to fast. However, you have to
embrace denormalized data, otherwise you will be working against yourself. Most don't offer
consistency across documents, or do so inefficiently. This means there's much less overhead when
performing an insert. These databases are often much easier to scale through sharding than relational databases.
This is because entire documents can be easily sharded by their primary key and little consideration
needs to be made to reduce running distributed queries across multiple shards. This is because all
of the data that you should care about exists solely in the document(s) that you are querying by
primary key.

Within the example of analytics for soccer games, imagine that a record for each game exists in a
relational database. Each game might contain relationships to the final score, when goals were
scored (and by who), when yellow/red cards were given (and to whom), etc.. This is all data that we
need to guarantee consistency for and belongs in a relational database. Now,
imagine that the players are wearing biometric devices that capture 50 different data points every second.
That's _a lot_ of data and we would want to push it to a non-relational database. If we decide to
partition this data on both the game id and player id (known as a composite key), we would be able
to access this biometric data for any given player in any given game.

This is where GraphQL can become really powerful in polyglot data architectures. Consider if we wanted to add
a graph to our dashboard that displays the weather for a specific game, a players heart rate over the length of a game, and we want to identify points
on the graph when any player scores and any player is given a yellow/red card. Given a regular CRUD
API, you might have to make several API calls to fetch all of this data:

```
/games?id=<gameId>
/scores?gameId=<gameId>
/cards?gameId=<gameId>
/biometrics?gameId=<gameId>&playerId=<playerId>
```

However, these APIs are likely returning full records. This is particularly important when
considering the biometrics could contain >100,000 data points for a single game. That's _a lot_ of
data that we don't actually care about. It wastes CPU cycles in serialization, deserialization,
compression, and decompression, requires more memory on the clients side to handle, and requires
more bandwidth to transmit and receive. All for a bunch of data that we won't use. In
contrast, a GraphQL request could fetch all of this data in a single request and only return the
values we actually care about:

```
POST /api
{
  "query": "
    query GetData($gameId, $playerId) {
      game(id: $gameId) {
        weather
        scores {
          timestamp
        }
        cards: {
          timestamp
        }
      }

      biometrics(gameId: $gameId, playerId: $playerId) {
        timestamp
        heartrate
      }
    }
  ",
  "variable": {
    "gameId": <gameId>,
    "playerId": <playerId>
  }
}
```
