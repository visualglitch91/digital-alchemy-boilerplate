Simple boilerplate for creating home automation workflows using **Digital Alchemy**

https://docs.digital-alchemy.app/

## 🏗️ Setup

### Prerequisites

Digital Alchemy targets `node20`, which is the only required system dependency.
You should have Home Assistant already running at this point.

### Clone

Clone the repository to your local machine and change directory to the new repo:

```bash
git clone git@github.com/visualglitch91/digital-alchemy-boilerplate.git

cd digital-alchemy-boilerplate
```

### Install Dependencies

Install dependencies using Yarn:

```bash
yarn install
```

### Configure

Create a new `.env` file based on the template.

```bash
cp .env.sample .env
```

## 💻 Commands

Once your environment is set up, you can use provided commands from within the `package.json` to manage your workspace.

| NPM Command       | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **`start`**       | ⏩ Run the server using tsx                                                                                                     |
| **`watch`**       | 👀 Run the server using tsx<br />**Automatically restart server on code changes**                                               |
| **`type-writer`** | 🖨️ Rebuild custom type definitions for Home Assistant<br />**Run any time you modify your setup for more accurate definitions** |
