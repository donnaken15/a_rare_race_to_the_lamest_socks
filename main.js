
import { $, sleep, sleepSync, spawn, spawnSync, which } from 'bun';
import {
	readFileSync, writeFileSync, mkdirSync, rmSync, rmdirSync, existsSync, unlinkSync, statSync
} from 'fs';
import {parse} from 'yaml';
import {extname} from 'path';
import {inspect} from 'util';
import {flatten} from 'array-flatten';
import {platform} from 'os'; // , basename
import {heapStats} from 'bun:jsc';
//import {deserialize, serialize} from 'bun:jsc';
'use strict';

console.log((await $`clear`.text())); // default clear func from --watch/--hot doesn't scroll back to the top

$.throws(false);
//console.log("1");
//console.log((await $`[ 0 -eq 4 ]`));
//console.log("2");

const wsl = platform() === 'linux' && which('wslpath') !== null;
const wslproxy = wsl ? "wsl2exe " : "";
const wslproxy2 = wsl ? ["wsl2exe"] : [];
console.time('declarations');
const [floor, round, rand, pow] = [Math.floor, Math.round, Math.random, Math.pow];
const [lsb, avg, commit, soxi, pt, sep, ff, shvar, argumentize, fix] = [
	n => Math.log2(n & -n), // https://www.geeksforgeeks.org/position-of-rightmost-set-bit/
	a => a.length > 0 ? a.reduce((p,a) => p+a)/a.length : 0,
	c => ("https://github.com/donnaken15/FastGH3/raw/"+c+"/DATA/MUSIC/TOOLS/"),
	async (f,sw) => (await $`${{raw: wslproxy}}sox --info "-${sw}" -- "${f}"`.text()).trim(),
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
	performance.now,
	platform() === 'win32' ? '\\' : '/',
	which("ffmpeg"),
	/(?<var>\\?\$([A-Z0-9_]+|{([A-Z0-9_])+}))/gmi,
	(argv, env) =>
		(typeof argv === 'string') ? argumentize(argv.split(' '), env) : (argv.map((x) =>
			x.replace(shvar, (cap,one,two,three,index,fullstr,groups) => // replace $* >
				one.startsWith('\\') ? one.substr(1) : // ignore escaped $
					env[(three ?? two ?? "").toUpperCase()] ?? one) // 321 lol // with env[*] <
				.replace(/^"|"$/g, "").trim() // trim quotes
		)),
	(n=0,p=1) => (round(n*pow(10,p))/(p<1?1:pow(10,p)))
];
//const ffconf = ["-hide_banner","-loglevel","warning"];
const [tS, tE, pad2, timefmt, log, error, warn] = [
	(n,p2=true) => {
		if (p2)
			process.stderr.write('[\x1b[1m'+'?'.repeat(5)+'\x1b[0m] '+n+'\r');
		console.time(n);
		return pt();
	},
	(t,n) => fix([pt() - t, console.timeEnd(n)][0], 6),
	(t,d='0') => t.toString().padStart(2,d),
	ms => (
		pad2(Math.floor(ms / 3600000)) + ':' +
		pad2(Math.floor((ms / 60000) % 60)) + ':' +
		pad2((ms/1000 % 60).toFixed(0))
	),
	console.log,
	console.error,
	(t,...a) => error("\x1b[33m"+t+"\x1b[0m",...a)
];
async function rimraf(f) { // --no-preserve-root
	try {
		rmSync(f, { recursive: true, force: true });
		rmdirSync(f, { recursive: true, force: true });
	} catch {
		//await $`rm -rf ${f}`;
		// why
	}
}
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
const [pipe_names, uids] = [
	['Bun shell','Bun async','Bun pipe2','External'], []
];
//const path = __dirname + (platform() === 'win32' ? ';' : ':') + process.env.path;
function randid() {
	var id;
	var c = 0;
	const sky = pow(10, 3 /*digits*/);
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
const data = parse(
	readFileSync(__dirname + '/data.yml').toString().replaceAll('\t', ' '), false, {merge: true}).data;
const pipe_runners = [
	// ================       SHELL       ================
	async (mode,proc,utils) => {
		'use strict';
		const srg8 = {dummy: "try	this	bot!"}; // surrogate, probably the term i'm trying to remember
		const esc = [...utils[0], srg8, ...utils[1]];
		const list = esc.map(a =>
			(a !== srg8 && typeof a !== srg8) ? ($.escape(a.replace('\\','\\\\'))) : '|'
		).join(' '); // :/
		//log(list);
		const cmd = $`${{raw: list}}`;
		await cmd.quiet();
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
		} // TODO: get progress bars from spawn calls or outputs to measure individual process times
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
		[...wslproxy2, ...(core.broken === true ? ['cmd.exe','/c','start','/wait','/min',''] : []), // gonna kms
			core.blob, ...argumentize(core.argv, env)], {
			stderr: false ? "inherit" : "pipe",
			stdout: false ? "inherit" : "pipe",
		} // TODO: print if non-zero
	).exited,
];
var res = [];
console.timeEnd('declarations');

//console.log(data);

$.throws(true);

//if (false)
{
	const wd = data.config.workingdir + sep;
	//const wd = await $`wslpath -u ${data.config.workingdir}`.text() + '/';
	const [conf, samps, chains, outpath] = [
		data.config, data.samples, data.chains, wd + randid()
	];
	if (!existsSync(wd))
		mkdirSync(wd, {recursive: true});
	await $`touch ${outpath}`; // screw linux
	await $`chmod +777 ${outpath}`; // screw linux
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
		await sleep(1000);
		var [st, sl] = [
			(await soxi(tmpaud,'t')),
			parseFloat(await soxi(tmpaud,'D'))
		];
		st = (st === 'vorbis') ? 'ogg' : st;
		const sre = conf.force_reconvert ?? s.reconvert_to;
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
				for (var t = 0, type; t < sre.length; t++)
				{
					if ((type = sre[t]) === st)
						continue;
					var rid = wd + randid();
						rid += '.'+type;
					await $`touch "${rid}"`; // screw linux
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
			chains: chains,
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
			if (!(c.enabled ?? true))
			{
				warn('chain '+c.name+' is declared disabled');
				continue;
			}
			if (c.pipe === NULL)
			{
				error('chain '+c.name+' has no pipe modes to test');
				continue;
			}
			var blobpath = (c.basepath ?? commit(c.snapshot)) ?? null;
			if (blobpath === null)
			{
				error('chain blob has invalid base path');
				continue;
			}
			if (!blobpath.endsWith('/'))
				blobpath += '/';
			const chain_test = {
				chain: ci,
				types: [],
				runs: {}
			};
			const types_supported = chain_test.types;
			const tmpdir = wd + randid() + sep;
			mkdirSync(tmpdir, {recursive: true});
			log(('downloading blobs from '+c.name).padStart(60,' ').padStart(80,'-'));
			if (c.hasOwnProperty('extrablobs'))
			{
				c.extrablobs = flatten(c.extrablobs); // stupid
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
					await $`chmod +x "${tmpdir + fn}"`; // screw linux
				}
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
					argv: c.core.argv,
					broken: c.core.broken // i hate this world
				}
				await $`chmod +x "${tmpdir + fn}"`; // screw linux
			}
			else
				exclude_pipes |= PIPE_EXTRN;
			if (wsl)
				exclude_pipes |= PIPE_ASYNC | PIPE_TYPED; // screw linux
			await $`chmod +x -R "${tmpdir}"`; // screw linux
			var modes = ((conf.force_pipes ?? NULL !== NULL) ? conf.force_pipes : (c.pipe ?? PIPE_ALL));
			if ((conf.force_pipes | modes & PIPE_EXTRN) && core === null)
			{
				error('chain '+c.name+' enables external pipe runner/program but has no path to it defined');
			}
			modes &= (~exclude_pipes);
			log(('running '+c.utils[0].name+" >>>> "+c.utils[1].name).padStart(80,'-'));
			const proc_paths = [];
			for (var i = 0; i < 2; i++)
			{
				if (!(c.utils[i].local ?? false))
				{
					var fn = c.utils[i].blob;
					var blob = (c.basepath ?? commit(c.snapshot)) ?? null;
					if (blob === null)
					{
						error('chain blob has invalid base path');
						continue next_chain;
					}
					if (!blob.endsWith('/'))
						blob += '/';
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
					await $`chmod +x "${exepath}"`; // screw linux
					proc_paths.push(exepath);
				}
				else
					proc_paths.push(c.utils[i].blob);
			}
			
			for (var __type = 0, type; (type = stl[__type]), __type < stl.length; __type++)
			{
				if (c.hasOwnProperty('excfmts'))
					if (c.excfmts.indexOf(type) > -1)
					{
						error('chain '+c.name+' does not support type '+type);
						chain_test.runs[type] = null;
						// undefined/hasOwnProperty checks piss me off for the different precise ways to check if an object is valid
						continue;
					}
				types_supported.push(type);
				log('processing ' + type);
				
				//log(pipe.toString(2).padStart(4,'0'));
				var utils = [];
				var env = {
					"1": src[type].file, "2": outpath, ...conf.vars,
					"C": conf.vars.M === MODE_MONO ? 1 : 2,
					"BH": conf.vars.B >> 1
				};
				for (var i = 0; i < 2; i++)
				{
					utils.push([proc_paths[i], ...argumentize(c.utils[i].argv, env)]);
					if (wsl)
						utils[i].unshift('wsl2exe');
				}
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
								
								var tuS = [false];
								var tu = (async() => {
									if (conf.all_pipes_at_once) return;
									while (!tuS[0]) {
										process.stderr.write(
											'[\x1b[1m'+(((pt()-et)/1000)
												.toString()
												.substr(0,4)
												.padEnd(2,'0')+'s')+'\x1b[0m]\r');
										await sleep(10);
									}
								})();
								
								//log(pipe_names[m]);
								await pipe_runners[m](1 << m, proc, utils, core, env);
								// run all modes at once? trollface // i did it.....
								if (use_proc)
								{
									await proc[0].exited;
									await proc[1].exited;
								}
								tuS[0] = true;
								
								et = tE(et, ttext);
								runs[m].push(et);
								await tu;
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
					log('  '+'-'.repeat(20)+'  ');
					
					
					Bun.gc(true);
					//log(heapStats());
				}
				chain_test.runs[type] = runs;
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
			await rimraf(tmpdir);
			//log(-1);
		}
		if (reconvert)
		{
			for (var t = 0, type; (type = sre[t]) !== st && t < sre.length; t++)
			{
				try {
					unlinkSync(src[type]);
				} catch {}
			}
		}
		try {
			unlinkSync(tmpaud); // i hate this so much
		} catch {}
		res.push(test);
	}
	await sleep(2000);
	if (existsSync(outpath))
		unlinkSync(outpath);
}
//log(heapStats());
log(inspect(res, false, 16, true));






//Bun.spawnSync(['cmd','/c','start',__dirname+"\\test.csv"]);

//console.log(timefmt(((sum / 40.000) / (8/2))));


