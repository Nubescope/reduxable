# Reduxable

Reusable Redux

(without boilerplate)

It's strongly based on Redux so you should know how it works before start using this library.

### Installation

To install the stable version:

```
npm install --save reduxable
```

### Motivation

Redux is great! It solves a really hard problem: **state managament**

And it does it in an simple, easy to understand way.

> The whole state of your app is stored in an object tree inside a single *store*.

> The only way to change the state tree is to emit an *action*, an object describing what happened.

> To specify how the actions transform the state tree, you write pure *reducers*.

This comes with a lot of benefits in terms of simplicity and tools, specially **great tools**.

But there are some issues that Redux does not solve:

- It's really difficult to reuse the code due to the global scope: the action types could collide
- We need to create a lot of boilerplate even for a tiny feature
- It's hard to refactor the code since to the lack of cohesion

Reduxable tackle all of this and aims to do it in an elegant way.

### Examples

* [Counter](https://github.com/underscopeio/reduxable/tree/master/examples/counter)

### Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/underscopeio/reduxable/releases) page.

### License

MIT
