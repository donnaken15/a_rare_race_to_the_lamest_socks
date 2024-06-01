
import { $, sleep, sleepSync, spawn, spawnSync, which } from 'bun';
import {
	readFileSync, writeFileSync, mkdirSync, rmSync, rmdirSync, existsSync, unlinkSync, statSync
} from 'fs';
import {extname} from 'path';
import {inspect} from 'util';
import {platform} from 'os'; // , basename
import {heapStats} from 'bun:jsc';
//import {deserialize, serialize} from 'bun:jsc';
'use strict';

console.log((await $`clear`.text())); // default clear func from --watch/--hot doesn't scroll back to the top

$.throws(false);
//console.log("1");
//console.log((await $`[ 0 -eq 4 ]`));
//console.log("2");

console.time('declarations');
const [lsb, avg, commit, soxi] = [
	n => Math.log2(n & -n), // https://www.geeksforgeeks.org/position-of-rightmost-set-bit/
	a => a.length > 0 ? a.reduce((p,a) => p+a)/a.length : 0,
	c => ("https://github.com/donnaken15/FastGH3/raw/"+c+"/DATA/MUSIC/TOOLS/"),
	async (f,sw) => (await $`sox --info "-${sw}" -- "${f}"`.text()).trim()
];
const shvar = /(?<var>\\?\$([A-Z0-9_]+|{([A-Z0-9_])+}))/gmi;
const argumentize = (argv, env) =>
	(typeof argv === 'string') ? argumentize(argv.split(' '), env) : (argv.map((x) =>
		x.replace(shvar, (cap,one,two,three,index,fullstr,groups) => // replace $* >
			one.startsWith('\\') ? one.substr(1) : // ignore escaped $
				env[three ?? two] ?? one) // 321 lol // with env[*] <
			.replace(/^"|"$/g, "").trim() // trim quotes
	));
//const ffconf = ["-hide_banner","-loglevel","warning"];
/*
-t	Show detected file-type
-r	Show sample-rate
-c	Show number of channels
-s	Show number of samples (0 if unavailable)
-d	Show duration in hours, minutes and seconds (0 if unavailable)
-D	Show duration in seconds (0 if unavailable)
-b	Show number of bits per sample (0 if not applicable)
-B	Show the bitrate averaged over the whole file (0 if unavailable)
-p	Show estimated sample precision in bits
-e	Show the name of the audio encoding
-a	Show file comments (annotations) if available
*/
const [floor, round, rand, pow] = [Math.floor, Math.round, Math.random, Math.pow];
const fix = (n=0,p=1) => (round(n*pow(10,p))/(p<1?1:pow(10,p)));
const [tS, tE, pad2, timefmt] = [
	(n,p2=true) => {
		if (p2)
			process.stderr.write('[\x1b[1m'+'?'.repeat(5)+'\x1b[0m] '+n+'\r');
		console.time(n);
		var pt = performance.now();
		return pt;
	},
	(t,n) => fix([performance.now() - t, console.timeEnd(n)][0], 6),
	(t,d='0') => t.toString().padStart(2,d),
	ms => (
		pad2(Math.floor(ms / 3600000)) + ':' +
		pad2(Math.floor((ms / 60000) % 60)) + ':' +
		pad2((ms/1000 % 60).toFixed(0))
	)
]
function rimraf(f) { // --no-preserve-root
	rmSync(f, { recursive: true, force: true });
	rmdirSync(f, { recursive: true, force: true });
}
const [log, error] = [
	console.log,
	console.error
];
const warn = (t,...a) => error("\x1b[33m"+t+"\x1b[0m",...a);
/*const stat = (f) =>	{
	var a = statSync();
	return {
		a: size
	};
}*/
/*
atime: [Getter/Setter],
atimeMs: [Getter/Setter],
birthtime: [Getter/Setter],
birthtimeMs: [Getter/Setter],
blksize: [Getter/Setter],
blocks: [Getter/Setter],
ctime: [Getter/Setter],
ctimeMs: [Getter/Setter],
dev: [Getter/Setter],
gid: [Getter/Setter],
ino: [Getter/Setter],
mode: [Getter/Setter],
mtime: [Getter/Setter],
mtimeMs: [Getter/Setter],
nlink: [Getter/Setter],
rdev: [Getter/Setter],
size: [Getter/Setter],
uid: [Getter/Setter],
*/
const [MODE_STEREO, MODE_JOINT, MODE_DUAL, MODE_MONO] = [0, 1, 2, 3];
const [NULL, PIPE_TYPED, PIPE_ASYNC, PIPE_REDIR, PIPE_EXTRN, PIPE_ALL] = [
	0,	// no flags, default force_pipes value
	1,	// run through bun's internal shell
	2,	// run through bun spawn and use async streams
	4,	// run through bun spawn and plainly redirect stream
	8,	// run dedicated program, utils is reaplced with core which is
		// i.e. c128ks, batch or exe, array is purely informative if this is only set
	15, // test all of the above
];
const pipe_names = ['Bun shell','Bun async','Bun pipe2','External'];
//const path = __dirname + (platform() === 'win32' ? ';' : ':') + process.env.path;
const uids = [];
function randid() {
	var id;
	var c = 0;
	const sky = pow(10, 7 /*digits*/);
	do {
		id = "--"+floor(rand() * sky).toString();
		if (++c >= sky)
		{
			error("Ran out of unique IDs"+("!".repeat(40)));
			process.exit(999);
		}
	} while (uids.indexOf(id) > -1);
	if (c > 1)
		warn('randid: collided '+c+' times');
	uids.push(id);
	return id;
}
const plain1_2 = '"$1" "$2"';
const	[
	lame_blob,
	sox_argv,
	c128ks_core_batch,
	c128ks_xblobs
]	=	[
	{
		argv: '--cbr -b $B --resample $R -m j - "$2"',
		blob: "lame.exe"
	},	[
		'--', '$1',
		'-c', '$C',
		'-r', '$R',
		'-S', '--multi-threaded',
		'-t', 'wav', '--', '-'
	],	{
		argv: plain1_2,
		blob: "c128ks.bat"
	},	[
		"libgcc_s_sjlj-1.dll",
		"libgomp-1.dll",
		"libwinpthread-1.dll",
		"zlib1.dll",
	]
];
const c128ks_old = {
	core: c128ks_core_batch,
	excfmts: [ "opus" ],
	pipe: PIPE_ALL,
};
const c128ks_opus_before_helix = [
	{ name: "SoX 14.4.2 (m-ab-s)", // built from media-autobuild-suite
		argv: sox_argv, blob: "sox.exe" },
	{ name: "LAME 3.98", ...lame_blob }, // dated 2008
];
const helix_blob = {
	argv: '- "$2" -B$BH -M1 -u2 -q1',
	blob: "lame.exe"
};
const data = {
	// need some way to allow this to be in a separate file like
	// an actual JSON file but have these variables used
	config: {
		runs: 8//times to encode and average using
		, vars: { // shell environment like variables
			R: 44100, B: 128, M: MODE_JOINT
		},
		workingdir: 'C:\\soxtest',//__dirname + '\\test\\',
		// override settings for individual instances
		force_pipes: NULL,
		force_reconvert: null,
		all_pipes_at_once: false
		// i forgot, the encoders are going to overwrite each other's output lol
		// and of course four tasks at once will make all them slower
	}, chains: [
		/**/
		{ /// chain schema almost :/
			name: "c128ks Jul 4, 2021",
			date: "2021-07-04",
			utils: [
				{ name: "SoX 14.4.0", // 2012 version
					argv: sox_argv,
					blob: "sox.exe" },
				{ name: "LAME 3.100.1", ...lame_blob },
			],
			//core: c128ks_core_batch,
			snapshot: "20ac219", // if specified, reference commit where this chain exists
			//basepath: commit("20ac219"), // if not specified, use commit(snapshot)
			extrablobs: [
				"lame_enc.dll",
				"libmad-0.dll",
				"libmp3lame-0.dll",
				...c128ks_xblobs
			],
			...c128ks_old
			//excfmts: [ "opus" ], // exclude decoding formats,
			//// because i did not have a sox build with opus dec in 2021
			//pipe: PIPE_ALL, // pipe modes to test, flags
		},/**/
		/**/
		{
			name: "c128ks May 23, 2022",
			date: "2022-05-23",
			utils: [
				{ name: "SoX 14.3.1",
					// 2010, got this from some zip, probably sourceforge
					argv: [
						'$1',
						'-c', '$C',
						'-r', '$R',
						'-S', '--multi-threaded',
						'-t', 'wav', '--', '-'
					],
					blob: "sox.exe" },
				{ name: "LAME 3.99.2.5", ...lame_blob },
			],
			snapshot: "54a7123", // stupid me
			extrablobs: [
				"libmad.dll",
				...c128ks_xblobs
			],
			...c128ks_old
		},/**/
		{
			name: "c128ks Jun 20, 2022",
			date: "2022-06-20",
			utils: c128ks_opus_before_helix, // sox built from media-autobuild-suite
			core: c128ks_core_batch, // lame dated 2008
			snapshot: "f13d001",
			pipe: PIPE_ALL
		},
		{
			name: "c128ks Nov 21, 2022",
			date: "2022-11-21",
			utils: c128ks_opus_before_helix,
			core: c128ks_core_batch,
			snapshot: "6540be6", // updated batch
			pipe: PIPE_ALL
		},
		{
			name: "c128ks Jan 15, 2023",
			date: "2022-01-15",
			utils: [
				{ name: "SoX 14.4.2 (m-ab-s)", argv: sox_argv, blob: "sox.exe" },
				{ name: "Helix 5.2.1", ...helix_blob }, // 1995-2005 software rebuilt by maik merten 2022
			],
			core: c128ks_core_batch,
			snapshot: "6540be6", // updated batch
			pipe: PIPE_ALL
		},
	], samples: [ // audio to test
		{
			name: "Aanguish", // my trusty loyal audio file(s)
			source: "http://localhost/test.ogg",
			//source: "https://github.com/donnaken15/charts/raw/master/Venetian%20Snares%20-%20Aanguish/song.ogg",
			reconvert_to: [ "wav", "mp3", "opus" ],
			//type: "ogg"
		},
	]
};
//console.log(data);
//throw 'asdf';
const pipe_runners = [
	// ================       SHELL       ================
	async (mode,proc,utils) => {
		'use strict';
		const srg8 = -444; // surrogate, probably the term i'm trying to remember
		const esc = [...utils[0], srg8, ...utils[1]];
		const list = esc.map(a =>
			(a !== srg8 && typeof a !== srg8) ? ($.escape(a.replace('\\','\\\\'))) : '|'
		).join(' '); // :/
		const cmd = await $`${{raw: list}}`.quiet();
	},
	// ================    ASYNCHRONOUS   ================
	async (mode,proc) => {
		'use strict';
		var dec_done = false;
		var enc_done = false;
		var done = false;
		var bp = [0, 0];
		var decoded_blocks = [];
		///dt = tS('decoder');
		var pipe = [
			proc[0].stdout.getReader(),
			proc[1].stdin
		];
		var dect = (async () => { // async decoder reader
			while (true)
			{
				var r = (await pipe[0].read());
				if (r.done)
				{
					///dt = tE(dt, 'decoder');
					pipe[0].releaseLock();
					await proc[0].stdout.cancel();
					dec_done = true;
					return;
				}
				decoded_blocks.push(r.value);
				bp[0]++;
			}
		})();
		while (!done) // encode available bytes from above
		{
			// for the length that the output isn't read from ffmpeg,
			// ffmpeg continues to build up the buffer that will get read eventually,
			// so instantly reading twice gets like 20-100 bytes, but waiting
			// a little will make it spit out a few hundred kb to few mb
			if (decoded_blocks.length < 1)
			{
				if (dec_done)
				{
					pipe[1].close();
					await proc[1].exited;
					enc_done = true;
					done = true;
				}
				await sleep(0);
			}
			else
				while (decoded_blocks.length > 0)
				{
					var block = decoded_blocks.shift();
					try {
						pipe[1].write(block);
						bp[1]++;
					}
					catch (ex) {
						error(ex);
						error("retrying...");
						decoded_blocks.unshift(block);
					}
				}
			if (!data.config.all_pipes_at_once)
				if (Math.floor(performance.now()) % 10 === 0)
					process.stdout.write(' '.repeat(25)+'-'.repeat(20)+"  blocks processed: "+bp[0]+", "+bp[1]+" \r");
			//await sleep(13);
		}
		await dect; // probably pointless
	},
	// ================ PLAIN REDIRECTION ================
	async (mode,proc) => {
		'use strict';
		///dt = tS('decoder');
		const die = proc[1].stdin;
		var pipe = [
			proc[0].stdout,
			new WritableStream({ // brain damage
				start: () => die.start(),
				write: (chnk) => die.write(chnk),
				close: () => die.close(),
				abort: () => die.abort(),
			}, { size: () => 1 })
		]
		pipe[0].pipeTo(pipe[1]);
		///dt = tE(dt, 'decoder');
	},
	// ================  EXTERNAL RUNNER  ================
	async (mode,proc,utils,core,env) => await Bun.spawn(
		[core.blob, ...argumentize(core.argv, env)], {stderr: "pipe"} // TODO: print if non-zero
	).exited,
];
var res = [];
console.timeEnd('declarations');

//console.log(data);

$.throws(true);

//if (false)
{
	const wd = data.config.workingdir + '\\';
	const [conf, samps, chains, outpath] = [
		data.config, data.samples, data.chains, wd + randid()
	];
	if (!existsSync(wd))
		mkdirSync(wd, {recursive: true});
	for (var si = 0, s; s = samps[si], si < samps.length; si++)
	{
		var tmpaud = wd + randid();
		log(s.name.padStart(35,' ').padStart(80,'-'));
		var sr = await fetch(s.source);
		if (!sr.ok)
		{
			error('Audio sample '+s.name+' not available');
			continue;
		}
		var sb = await sr.arrayBuffer();
			tmpaud += extname(s.source);
		writeFileSync(tmpaud, sb);
		var [st, sl] = [ (await soxi(tmpaud,'t')), parseFloat(await soxi(tmpaud,'D')) ];
		st = (st === 'vorbis') ? 'ogg' : st;
		const sre = conf.force_reconverts ?? s.reconvert_to;
		const stl = [st];
		const src = {};
		src[st] = {
			file: tmpaud,
			size: statSync(tmpaud).sync
		}
		const reconvert = Array.isArray(sre);
		
		{
			var rtasks = [];
			if (reconvert)
			{
				log("reconverting "+st+" to formats "+sre.toString());
				for (var t = 0, type;
					(type = sre[t]) !== st &&
					t < sre.length; t++)
				{
					var rid = wd + randid();
						rid += '.'+type;
					rtasks.push(
						$`ffmpeg -i "${tmpaud}" -f "${type}" -- "${rid}" -y -hide_banner -loglevel error`
					);
					src[type] = {
						file: rid
					};
					stl.push(type);
				}
			}
			await Promise.allSettled(rtasks);
			//rtasks = [];
			for (var i = 0, sp; sp = src[stl[i]], i < stl.length; i++)
				sp.size = statSync(sp.file).size;
				//rtasks.push((async() => sp.stat = stat(sp.path))());
			//await Promise.allSettled(rtasks);
		}
		
		const test = {
			name: s.name,
			length: sl,
			formats: stl,
			sources: src,
			tests: []
		};
		const tests = test.tests;
		
		// this code starts to get all over the place
		// grease to have to redownload chain executables for every single sample
		next_chain: for (var ci = 0, c; c = chains[ci], ci < chains.length; ci++)
		{
			//log(c);
			if (c.utils.length < 1 && c.utils.length > 2)
			{
				error('chain '+c.name+' has an invalid amount of utilities');
				continue;
			}
			if (c.pipe === NULL)
			{
				error('chain '+c.name+' has no pipe modes to test');
				continue;
			}
			const blobpath = (c.basepath ?? commit(c.snapshot)) ?? null;
			if (blobpath === null)
			{
				error('chain blob has invalid base path');
				continue;
			}
			const chain_test = {
				chain: ci,
				types: [],
				runs: {}
			};
			const types_supported = chain_test.types;
			const tmpdir = wd + randid() + '\\';
			mkdirSync(tmpdir, {recursive: true});
			log(('downloading blobs from '+c.name).padStart(60,' ').padStart(80,'-'));
			if (c.hasOwnProperty('extrablobs'))
				for (var i = 0; i < c.extrablobs.length; i++)
				{
					var fn = c.extrablobs[i];
					var blob = blobpath + fn;
					var dl = await fetch(blob);
					if (!dl.ok)
					{
						error('chain blob is missing: '+blob);
						rimraf(tmpdir);
						continue next_chain;
					}
					var file = await dl.arrayBuffer();
					writeFileSync(tmpdir + fn, file);
				}
			var core = null;
			var exclude_pipes = NULL;
			if (c.hasOwnProperty('core'))
			{
				var fn = c.core.blob;
				var blob = blobpath + fn;
				var dl = await fetch(blob);
				if (!dl.ok)
				{
					error('chain blob is missing: '+blob);
					break;
				}
				var file = await dl.arrayBuffer();
				writeFileSync(tmpdir + fn, file);
				core = {
					blob: tmpdir + fn,
					argv: c.core.argv
				}
			}
			else
				exclude_pipes |= PIPE_EXTRN;
			var modes = ((conf.force_pipes !== NULL) ? conf.force_pipes : c.pipe);
			if ((conf.force_pipes | modes & PIPE_EXTRN) && core === null)
			{
				error('chain '+c.name+' enables external pipe runner/program but has no path to it defined');
			}
			modes &= (~exclude_pipes);
			log(('running '+c.utils[0].name+" >>>> "+c.utils[1].name).padStart(80,'-'));
			const proc_paths = [];
			for (var i = 0; i < 2; i++)
			{
				var fn = c.utils[i].blob;
				var blob = (c.basepath ?? commit(c.snapshot)) ?? null;
				if (blob === null)
				{
					error('chain blob has invalid base path');
					continue next_chain;
				}
				blob += fn;
				var dl = await fetch(blob);
				if (!dl.ok)
				{
					error('chain blob is missing: '+blob);
					continue next_chain;
				}
				var exeb = await dl.arrayBuffer();
				var exepath = tmpdir + (core === null ? (randid() + ".exe") : fn);
				writeFileSync(exepath, exeb);
				proc_paths.push(exepath);
			}
			
			for (var __type = 0, type; (type = stl[__type]), __type < stl.length; __type++)
			{
				if (c.hasOwnProperty('excfmts'))
					if (c.excfmts.indexOf(type) > -1)
					{
						error('chain '+c.name+' does not support type '+type);
						chain_test.runs[type] = null;
						// undefined/null/hasOwnProperty checks piss me off for the different precise ways to check if an object is valid
						continue;
					}
				types_supported.push(type);
				log('processing ' + type);
				
				//log(pipe.toString(2).padStart(4,'0'));
				var utils = [];
				var env = {
					"1": src[type].file, "2": outpath, ...conf.vars,
					"C": conf.vars.M === MODE_MONO ? 1 : 2,
					"BH": conf.vars.B >> 1,
				};
				for (var i = 0; i < 2; i++)
					utils.push([proc_paths[i], ...argumentize(c.utils[i].argv, env)]);
				//log(utils);
				//log(env);
				
				const runs = [
					[], [], [], []
				];
				for (var i = 1; i <= conf.runs; i++)
				{
					var tasks = [];
					for (var m = 0; m < 4; m++) // nether, hyper, mega, super lol
					{
						if (!(modes >> m & 1))
							continue;
						const task =  (async (i, m) => {
							try {
								var proc;
								var use_proc = ((1 << m) & (PIPE_ASYNC | PIPE_REDIR)) !== 0;
								if (use_proc)
								{
									proc = [
										Bun.spawn(utils[0], {stdin: null, stderr: "pipe"}),
										Bun.spawn(utils[1], {stdin: "pipe", stdout: null, stderr: "pipe"})
									];
								}
								
								var ttext = 'run '+i.toString()+' '+pipe_names[m];
								var et = tS(ttext, !conf.all_pipes_at_once);
								
								//log(pipe_names[m]);
								await pipe_runners[m](1 << m, proc, utils, core, env);
								// run all modes at once? trollface // i did it.....
								if (use_proc)
								{
									await proc[0].exited;
									await proc[1].exited;
								}
								
								et = tE(et, ttext);
								runs[m].push(et);
								//process.stdout.write('\n');
								//log((await $`ffprobe -hide_banner test.mp3 2>&1`.text()).trim());
							}
							catch (e) {
								console.error(e);
								if (use_proc)
									for (var j = 0; j < 2; j++)
										console.error(await Bun.readableStreamToText(proc[j].stderr));
							}
						})(i, m);
						if (!conf.all_pipes_at_once)
							await task;
						else
							tasks.push(task);
					}
					if (conf.all_pipes_at_once)
						await Promise.allSettled(tasks);
					console.log('  '+'-'.repeat(20)+'  ');
					
					
					Bun.gc(false);
					//log(heapStats());
				}
				chain_test.runs[type] = runs;
				if (existsSync(outpath))
					rmSync(outpath);
			}
			tests.push(chain_test);
			//log(0);
			//sleepSync(7000);
			//log(3);
			//sleepSync(1000);
			//log(2);
			//sleepSync(1000);
			//log(1);
			//sleepSync(1000);
			rimraf(tmpdir);
			//log(-1);
		}
		if (reconvert)
		{
			for (var t = 0, type;
				(type = sre[t]) !== st &&
				t < sre.length; t++)
			{
				try {
					unlinkSync(src[type]);
				} catch {}
			}
		}
		try {
			unlinkSync(tmpaud);
		} catch {}
		res.push(test);
	}
}
//log(heapStats());
log(inspect(res, false, 16, true));






//Bun.spawnSync(['cmd','/c','start',__dirname+"\\test.csv"]);

//console.log(timefmt(((sum / 40.000) / (8/2))));


