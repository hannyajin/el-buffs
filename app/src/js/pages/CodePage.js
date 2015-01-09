var React = require('react');

var CodePage = React.createClass({
  render: function () {
    return (
      <div className="page">Code page.
        <pre>
          <code>
            Code block Code block Code block Code block
          </code>
        </pre>
      </div>
    );
  }
});

module.exports = CodePage;