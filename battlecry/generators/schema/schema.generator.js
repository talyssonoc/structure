import { Generator, File } from 'battlecry';
import Attribute from './Attribute';

const DIST = 'src/domain/__na-me__'

export default class SchemaGenerator extends Generator {
  config = {
    generate: {
      args: 'name ...props?',
      description: 'Create or modify schema adding attributes and methods'
    }
  };

  get props() {
    const props = this.args.props.length ? this.args.props : ['name'];
    return props.reverse();
  }

  generate() {
    const template = this.template();
    let file = new File(`${DIST}/${template.filename}`, this.args.name);
    if(!file.exists) file = template;

    this.props.forEach(prop => {
      if(prop.startsWith(':')) this.addMethod(file, prop)
      else this.addAttribute(file, prop);
    });

    file.saveAs(`${DIST}/${template.filename}`, this.args.name);
  }

  addAttribute(file, name) {
    const attribute = new Attribute(name);
    file.after('attributes({', attribute.text, attribute.name);
  }

  addMethod(file, name) {
    file.after('class ', [
      '  __naMe__() {',
      '    // Do something here',
      '  }',
      ''
    ], name.substring(1));
  }
}
