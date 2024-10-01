import { runTestSet } from '../run-test-set';
import { config } from './config';
import { fileSystem } from './file-system';

// runaway phase checking, aka infinitely looping through phases.

runTestSet({
	name: 'infinite-loop',
	desc: 'infinite loop from runaway phase checking',
	config,
	fileSystem,
	cases: [
		{
			name: 'regular route is processed normally',
			paths: ['/api/hello'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/api/hello', params: [] }),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/api/hello',
				},
			},
		},
		{
			name: 'invalid asset with contradicting `miss` and `none` returns 404',
			paths: ['/invalid'],
			input: {},
			expected: {
				status: 404,
				data: '<html>404</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/404',
				},
			},
		},
		{
			name: 'infinite phase checking returns 500 and logs an error',
			paths: ['/infinite'],
			input: {},
			expected: {
				status: 500,
				data: '<html>500</html>',
				mockConsole: {
					error: ['Routing encountered an infinite loop while checking /infinite'],
				},
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/500',
				},
			},
		},
	],
});
