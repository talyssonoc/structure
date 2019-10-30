const isValidPath = (path) => Boolean(path && path.length);

const areExpectedErrorsPathsValid = (expectedErrors) => expectedErrors.every(errorHasPath);
const errorHasPath = (error) => isValidPath(error.path);

const groupByPath = (errors, context) =>
  errors.reduce((grouped, error) => {
    const group = grouped.find((group) => context.equals(group.path, error.path));

    if (group) {
      group.messages.push(error.message);
      return grouped;
    }

    const newGroup = { path: error.path, messages: [error.message] };

    return [...grouped, newGroup];
  }, []);

module.exports = { isValidPath, areExpectedErrorsPathsValid, groupByPath };
