# kumbocli

**Purpose**

I need a CLI to automatically create a new node project with a given template.


## Usage

```
Usage: kumbocli [options]

Create node CLI apps in seconds - with templates.

Options:
  -V, --version              output the version number
  -n, --name <NAME>          set the name of the new CLI app (default: "")
  -d, --description <DESC>   set the description (default: "")
  -a, --author               set the author
  -t, --template <TEMPLATE>  set the directory of the template (default: "data/templates/default-cli")
  -h, --help                 output usage information
```

Run the following commands afterwards:

1. `cd <NAME>`
2. `npm i`

You can run your new CLI program simply with: 

- `bin/<NAME>`