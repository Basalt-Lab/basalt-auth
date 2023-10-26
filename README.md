# 📦 Basalt-auth

## 📌 Table of contents

- [📦 Basalt-auth](#-basalt-auth)
    - [📌 Table of contents](#-table-of-contents)
    - [📝 Description](#-description)
    - [🌟 Features](#-features)
    - [🔧 Installation](#-installation)
    - [📋 Future Plans](#-future-plans)
    - [👥 Contributing](#-contributing)
    - [⚖️ License](#-license)
    - [📧 Contact](#-contact)

## 📝 Description

`Basalt-auth` is a library designed to enhance the security of your applications by adopting a simplified yet effective approach to authentication and token management.

Drawing inspiration from [JSON Web Tokens (JWT)](https://jwt.io/), `Basalt-auth` stands out by offering an alternative solution that embraces the fundamental strengths of JWTs while enriching the user experience with expanded capabilities.

One of the main advantages of `Basalt-auth` lies in its key management: instead of using a global secret key, it generates a unique key pair for each token, thereby increasing the security of the individual session.

Only the public key and the token are retained, ensuring that interactions remain secure and private.


## 🌟 Features

- `BasaltToken` encompasses a robust suite of functionalities tailored for secure token handling and authentication:

  - **Token Structure Validation**: Ensures the integrity of the token's structure, verifying that it contains all the necessary components.

  - **Dynamic Header Construction**: Assembles a token header with vital metadata, including unique identifiers and expiration details, enhancing tracking and security.

  - **Flexible Payload Management**: Encodes a payload into the token, allowing for a broad range of information to be securely embedded within.

  - **Robust Signature Generation**: Utilizes private keys to generate an indisputable signature, confirming the authenticity of the token's content.

  - **Comprehensive Token Information Retrieval**: Grants access to crucial token information such as UUID, expiration date, audience, and issuer, thereby enhancing validation processes and usage context.

  - **Advanced Token Parsing**: Retrieves the token's header or payload, decoding its content for further internal operations or validation procedures.

  - **Expiration Check Utility**: Quickly determines the validity period of a token, ensuring interactions rely on timely and relevant authentication data.

  - **Token Signing Ceremony**: Seamlessly signs tokens with essential information, utilizing a generated key pair for heightened security measures.

  - **Integrity and Timeliness Verification**: Validates a token's signature and checks its expiration, confirming the token's legitimacy and ongoing relevance before acceptance.

These features collectively ensure that `BasaltToken` delivers a comprehensive, secure, and highly adaptable token management experience, serving diverse authentication requirements and operational contexts.

## 🔧 Installation

```
npm i @basalt-lab/basalt-auth
```

## 👥 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Reques to stage

## ⚖️ License

Distributed under the MIT License. See LICENSE for more information.

## 📧 Contact

Mail - [basalt-lab@proton.me](basalt-lab@proton.me)

[Project link](https://github.com/Basalt-Lab/basalt-auth)
