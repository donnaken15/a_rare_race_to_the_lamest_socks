
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
const lsb = n => Math.log2(n & -n); // https://www.geeksforgeeks.org/position-of-rightmost-set-bit/
const avg = a => a.length > 0 ? a.reduce((p,a) => p+a)/a.length : 0;
const shvar = /(?<var>\\?\$([A-Z0-9_]+|{([A-Z0-9_])+}))/gmi;
const argumentize = (argv, env) =>
	(typeof argv === 'string') ? argumentize(argv.split(' '), env) : (argv.map((x) =>
		x.replace(shvar, (cap,one,two,three,index,fullstr,groups) => // replace $* >
			one.startsWith('\\') ? one.substr(1) : // ignore escaped $
				env[three ?? two] ?? one) // 321 lol // with env[*] <
			.replace(/^"|"$/g, "").trim() // trim quotes
	));
//const ffconf = ["-hide_banner","-loglevel","warning"];
const commit = c => ("https://github.com/donnaken15/FastGH3/raw/"+c+"/DATA/MUSIC/TOOLS/");
const soxi = async (f,sw) => (await $`sox --info "-${sw}" -- "${f}"`.text()).trim();
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
const [tS, tE, pad2, fix] = [
	n => [performance.now(), console.time(n)][0],
	(t,n) => [performance.now() - t, console.timeEnd(n)][0],
	(t,d='0') => t.toString().padStart(2,d),
	(n=0,p=1) => (round(n*pow(10,p))/(p<1?1:pow(10,p)))
]
function rimraf(f) { // --no-preserve-root
	rmSync(f, { recursive: true, force: true });
	rmdirSync(f, { recursive: true, force: true });
}
const log = console.log;
const error = console.error;
const warn = (t,...a) => console.error("\x1b[33m"+t,...a);
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
const timefmt = ms =>
	pad2(Math.floor(ms / 3600000)) + ':' +
	pad2(Math.floor((ms / 60000) % 60)) + ':' +
	pad2((ms/1000 % 60).toFixed(0));
const [MODE_STEREO, MODE_JOINT, MODE_DUAL, MODE_MONO] = [0, 1, 2, 3];
const [NULL, PIPE_TYPED, PIPE_ASYNC, PIPE_REDIR, PIPE_EXTRN] = [
	0,	// no flags, default force_pipes value
	1,	// run through bun's internal shell
	2,	// run through bun spawn and use async streams
	4,	// run through bun spawn and plainly redirect stream
	8,	// run dedicated program, utils is reaplced with core which is
		// i.e. c128ks, batch or exe, array is purely informative at that point
];
const pipe_names = ['Bun shell','Bun async','Bun pipeTo','External'];
//const path = __dirname + (platform() === 'win32' ? ';' : ':') + process.env.path;
const uids = [];
function randid() {
	var id;
	var c = 0;
	do {
		id = "--"+floor(rand() * pow(10, 7 /*digits*/)).toString();
		c++;
	} while (uids.indexOf(id) > -1);
	if (c > 1)
		warn('randid: collided '+c+' times');
	uids.push(id);
	return id;
}
const data = {
	// need some way to allow this to be in a separate file like
	// an actual JSON file but have these variables used
	config: {
		runs: 3//times to encode and average using
		, vars: { // shell environment like variables
			R: 44100, B: 128, M: MODE_JOINT
		},
		// override settings for individual instances
		force_pipes: NULL,
		force_reconvert: null,
		workingdir: __dirname + '\\test\\'
	}, chains: [
		{ /// chain schema almost :/
			name: "c128ks July 4, 2021 (Non-batch, no MP3)",
			date: "2021-07-04",
			utils: [
				{ name: "SoX 14.4.0", // 2012 version
					argv: [
						'--', '$1', '-c', '$C',
						'-r', '$R', '-S',
						'-C', '$B', '--multi-threaded',
						'-t', 'wav', '--', '-'
					],
					blob: "sox.exe" },
				{ name: "LAME 3.100.1",
					argv: '--cbr -b $B --resample $R -m j - "$2"',
					blob: "lame.exe" },
			],
			//core: {
			//	argv: '"$1" "$2"',
			//	blob: "c128ks.bat"
			//},
			snapshot: "20ac219", // if specified, reference commit where this chain exists
			//basepath: commit("20ac219"), // if not specified, use commit(snapshot)
			extrablobs: [
				"lame_enc.dll",
				"libgcc_s_sjlj-1.dll",
				"libgomp-1.dll",
				//"libmad-0.dll",
				//"libmp3lame-0.dll",
				"libwinpthread-1.dll",
				"zlib1.dll"
			],
			excfmts: [ "opus", "mp3" ], // exclude decoding formats,
			// because i did not have a sox build with opus dec in 2021
			///////// and libmad isn't supposed to be included because LAME already <-- got alzheimers, can't confirm rn
			///////// decodes MP3, as set in the batch script, and SoX does it slower
			pipe: PIPE_ASYNC | PIPE_REDIR, // pipe modes to test, flags
		}, {
			name: "c128ks July 4, 2021 (Batch)",
			date: "2021-07-04",
			utils: [
				{ name: "SoX 14.4.0",
					argv: [
						'--', '$1', '-c', '$C',
						'-r', '$R', '-S',
						'-C', '$B', '--multi-threaded',
						'-t', 'wav', '--', '-'
					],
					blob: "sox.exe" },
				{ name: "LAME 3.100.1",
					argv: '--cbr -b $B --resample $R -m j - "$2"',
					blob: "lame.exe" },
			],
			core: {
				argv: '"$1" "$2"',
				blob: "c128ks.bat"
			},
			snapshot: "20ac219",
			extrablobs: [
				"lame_enc.dll",
				"libgcc_s_sjlj-1.dll",
				"libgomp-1.dll",
				"libmad-0.dll",
				"libmp3lame-0.dll",
				"libwinpthread-1.dll",
				"zlib1.dll"
			],
			excfmts: [ "opus" ],
			pipe: PIPE_EXTRN,
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
	var tmpaud = wd + randid();
	if (!existsSync(wd))
		mkdirSync(wd, {recursive: true});
	for (var si = 0, s; s = samps[si], si < samps.length; si++)
	{
		log(s.name);
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
					}
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
			log('downloading blobs from '+c.name);
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
				error('chain '+c.name+' enables external pipe runner/program but is not specified');
			}
			modes & ~exclude_pipes;
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
				if (c.excfmts.indexOf(type) > -1)
				{
					error('chain '+c.name+' does not support type '+type);
					continue;
				}
				types_supported.push(type);
				log('processing ' + type);
				
				//log(pipe.toString(2).padStart(4,'0'));
				var dt, et;
				var utils = [];
				var env = {
					"1": src[type].file, "2": outpath, ...conf.vars,
					"C": conf.vars.M === MODE_MONO ? 1 : 2,
				};
				for (var i = 0; i < 2; i++)
					utils.push([proc_paths[i], ...argumentize(c.utils[i].argv, env)]);
				//log(utils);
				
				const runs = [
					[], [], [], []
				];
				// TODO: print error stream if exited with non-zero
				for (var i = 1; i <= conf.runs; i++)
				{
					var ttext = 'run '+(i).toString();	
					var proc, pipe;
					//if (modes & (PIPE_REDIR | PIPE_ASYNC)) // replace with === 0 check once all modes are implemented
					//	proc = [
					//		Bun.spawn(utils[0], {stdin: null, stderr: null}),
					//		Bun.spawn(utils[1], {stdin: "pipe", stdout: null, stderr: null})
					//	];
					// make function array and loop through flags
					if (modes & PIPE_ASYNC)
					{
						var dec_done = false;
						var enc_done = false;
						var done = false;
						var bp = [0, 0];
						var decoded_blocks = [];
						///dt = tS('decoder');
						et = tS(ttext);
						//log('GO!');
						proc = [
							Bun.spawn(utils[0], {stdin: null, stderr: null}),
							Bun.spawn(utils[1], {stdin: "pipe", stdout: null, stderr: null})
						];
						pipe = [
							proc[0].stdout.getReader(),
							proc[1].stdin
						];
						//log(proc);
						// i hate this language so hard
						var dect = (async () => { // async decoder reader
							while (true)
							{
								var r = (await pipe[0].read());
								if (r.done)
								{
									///dt = tE(dt, 'decoder');
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
							// ffmpeg continues to build up the buffer that will get read,
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
							if (Math.floor(performance.now()) % 10 === 0)
								process.stdout.write(' '.repeat(20)+'-'.repeat(20)+"  blocks processed: "+bp[0]+", "+bp[1]+" \r");
							//await sleep(13);
						}
						await dect; // probably pointless
						et = tE(et, ttext);
						runs[lsb(PIPE_ASYNC)].push(et);
						//process.stdout.write('\n');
						//log((await $`ffprobe -hide_banner test.mp3 2>&1`.text()).trim());
					}
					if (modes & PIPE_REDIR)
					{
						///dt = tS('decoder');
						et = tS(ttext);
						//log('GO!');
						proc = [
							Bun.spawn(utils[0], {stdin: null, stderr: null}),
							Bun.spawn(utils[1], {stdin: "pipe", stdout: null, stderr: null})
						];
						const die = proc[1].stdin;
						pipe = [
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
						await proc[0].exited;
						await proc[1].exited;
						et = tE(et, ttext);
						runs[lsb(PIPE_REDIR)].push(et);
					}
					if (core !== null)
						if (modes & PIPE_EXTRN)
						{
							et = tS(ttext);
							Bun.spawnSync([core.blob, ...argumentize(core.argv, env)]);
							et = tE(et, ttext);
							runs[lsb(PIPE_REDIR)].push(et);
						}
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
log(inspect(res, true, 16, true));






//Bun.spawnSync(['cmd','/c','start',__dirname+"\\test.csv"]);

//console.log(timefmt(((sum / 40.000) / (8/2))));


