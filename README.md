# Weighter Web
Weight-loss oriented social network created for the [2020 Hack Heroes hackathon](http://hackheroes.pl/).

## Links
- [Web app](https://weighter.app)
- [API repository](https://gitlab.com/JakubMeysner/weighter-api)

## Deployment
Docker is the recommended deployment method.

| Name         | Value                                           |
|--------------|-------------------------------------------------|
| Image        | `registry.gitlab.com/jakubmeysner/weighter-web` |
| Exposed port | 8080                                            |

### Environment variables

| Name                   | Description              | Accepts                  | Required | Default                 |
|------------------------|--------------------------|--------------------------|----------|-------------------------|
| `NODE_ENV`             | Application mode         | `production|development` | No       |                         |
| `VUE_APP_GRAPHQL_HTTP` | HTTP endpoint URL of API | string                   | No       | `http://localhost:8081` |
| `VUE_APP_GRAPHQL_WS`   | WS endpoint URL of API   | string                   | No       | `ws://localhost:8081`   |
