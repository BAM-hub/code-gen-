const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const response = require("./response.json");

class PageGenerator {
  appPath;
  templates;
  constructor() {
    this.appPath = path.resolve("../src/app/");
    const components = fs.readdirSync("../src/components/");
    const templateFiles = fs.readdirSync("../src/templates/");
    this.templates = templateFiles.reduce((prev, curr) => {
      const name = curr.replace(".tsx", "");
      return {
        ...prev,
        [name]: `@/templates/${name}`,
      };
    }, {});
  }
  handleComonentImports(page, imports) {
    page.components.forEach((component) => {
      if (!imports.find((imptd) => imptd.name === component.name)) {
        if (this.templates[component.name]) {
          // just import it
          imports.push({
            name: component.name,
            path: this.templates[component.name],
          });
          if (component?.children?.length > 0) {
            this.handleComonentImports(
              { components: [...component.children] },
              imports
            );
          }
        } else {
          // create it in overridesa
        }
      }
    });
  }
  handleEmbedProps(page, imports) {
    const genPath = path.resolve("../src/embed");
    if (!fs.existsSync(genPath)) {
      this.handleCreateFileTree(genPath);
    }
    page.components = page.components.map((component) => {
      if (!imports.find((imptd) => imptd.name === `${component.name}Config`)) {
        const embedJsonPath = genPath + `${page.path === "/" ? "" : page.path}`;
        //create embed
        if (embedJsonPath) {
          this.handleCreateFileTree(embedJsonPath);
        }
        fs.writeFileSync(
          embedJsonPath + `/${component.id}.json`,
          JSON.stringify(component.embedProps)
        );
        component.props = `${component.name}${component.id}Config`;
        // just import it
        imports.push({
          name: `${component.name}${component.id}Config`,
          path: `@/embed${page.path === "/" ? "" : page.path}/${
            component.id
          }.json`,
        });
        if (component?.children?.length > 0) {
          this.handleEmbedProps(
            { ...page, components: [...component.children] },
            imports
          );
        }
        return component;
      }
    });
  }
  handleCreateFileTree(genPath) {
    const pathCrumbs = genPath.split("/");
    let prevPaths = "";
    pathCrumbs.slice(1).forEach((path) => {
      if (!fs.existsSync(prevPaths + `/${path}`)) {
        fs.mkdirSync(prevPaths + `/${path}`);
      }
      prevPaths += `/${path}`;
    });
  }
  async generate() {
    response.forEach(async (page) => {
      let imports = [];
      const genPath = this.appPath + page.path;

      // create filetree if not alredy exists
      if (!fs.existsSync(genPath)) {
        this.handleCreateFileTree(genPath);
      }

      this.handleComonentImports(page, imports);
      this.handleEmbedProps(page, imports);
      //gen code using page template
      console.log(page.components);
      const code = await ejs.renderFile("./page.ejs", {
        imports,
        name: page.name,
        components: page.components,
      });
      fs.writeFileSync(genPath + `/page.tsx`, code);
    });
  }
}

const generator = new PageGenerator();
generator.generate();
