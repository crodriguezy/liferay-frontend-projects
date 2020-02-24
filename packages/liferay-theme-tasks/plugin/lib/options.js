/**
 * SPDX-FileCopyrightText: © 2017 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: MIT
 */

'use strict';

const fs = require('fs');
var _ = require('lodash');
var path = require('path');

var {getArgv} = require('../../lib/util');

module.exports = function(options) {
	var argv = getArgv();

	var CWD = process.cwd();

	var distName = path.basename(CWD);

	var pkg;

	try {
		pkg = JSON.parse(
			fs.readFileSync(path.join(CWD, 'package.json'), 'utf8')
		);

		distName = pkg.name;
	} catch (e) {
		// Swallow.
	}

	distName = options.distName || distName;

	if (/\${/.test(distName) && pkg) {
		var distNameTemplate = _.template(distName);

		distName = distNameTemplate(pkg);
	}

	options.argv = argv;
	options.distName = distName;
	options.pathDist = options.pathDist || 'dist';
	options.rootDir = options.rootDir || 'docroot';
	options.storeConfig = _.assign(
		{
			name: 'LiferayPlugin',
			path: 'liferay-plugin.json',
		},
		options.storeConfig
	);

	return options;
};
