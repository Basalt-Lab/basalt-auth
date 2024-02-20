# 📦 Basalt-auth

## 📌 Table of contents

- [📦 Basalt-auth](#-basalt-auth)
  - [📌 Table of contents](#-table-of-contents)
  - [📝 Description](#-description)
  - [🌟 Documentation](#-documentation)
  - [🔧 Installation](#-installation)
  - [⚖️ License](#️-license)
  - [📧 Contact](#-contact)

## 📝 Description

`Basalt-auth` is a library designed to create a secure and user-friendly authentication system.  
It is inspired by [JSON Web Tokens (JWT)](https://jwt.io/), with some differences.

One of the main differences of `Basalt-auth` is the key management: instead of using a global secret key, it generates a unique key pair for each token, thereby increasing the security of the individual session.

Only the public key and the token are stored, ensuring that interactions remain secure and private.

`Basalt-auth` is also designed to be easy to use, with a simple and intuitive API.

## 🌟 Documentation

- [Documentation](https://basalt-lab.github.io/basalt-doc/index.html).
- [References](https://basalt-lab.github.io/basalt-auth/index.html).

## 🔧 Installation

NPM:
```bash
npm i @basalt-lab/basalt-auth
```

PNPM:
```bash
pnpm i @basalt-lab/basalt-auth
```

## ⚖️ License

Distributed under the MIT License. See LICENSE for more information.

## 📧 Contact

Mail - [basalt-lab@proton.me](basalt-lab@proton.me)

[Project link](https://github.com/Basalt-Lab/basalt-auth)
