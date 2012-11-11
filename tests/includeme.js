var x = 0

function increase() {
  ++x
}

function get() {
  return x
}

exports.get = get
exports.increase = increase
