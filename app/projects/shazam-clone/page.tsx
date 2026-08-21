import Link from "next/link";
import {
  Bibtex,
  Callout,
  CodeBlock,
  Diagram,
  DocIcon,
  FigureFrame,
  GithubIcon,
  Math,
  MathBlock,
  PaperHero,
  PaperSection,
  Prose,
  ResultsTable,
} from "@/components/paper";
import {
  ConstellationFigure,
  HashLayoutFigure,
  MatchScoringFigure,
} from "./figures";

const REPO = "https://github.com/ashma2583/working-shazam-clone";

export const metadata = {
  title: "Shazam Clone — Ashton Ma",
  description:
    "An audio fingerprinting engine. Spectrogram peaks to 32-bit hashes to a SQLite index, served over Flask to a React Native app that listens through the phone microphone.",
};

const mono =
  "rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-neutral-900";

export default function ShazamClone() {
  return (
    <article className="mx-auto max-w-5xl">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-[var(--accent)]"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        All projects
      </Link>

      <div className="mt-10">
        <PaperHero
          eyebrow="Michigan Data Science Team · Fall 2025"
          title="Shazam Clone"
          // subtitle="Name the song from ten seconds of a noisy room."
          authors={[{ name: "Ashton Ma", href: "https://github.com/ashma2583" }]}
          affiliation="Michigan Data Science Team, University of Michigan"
          links={[
            { label: "Code", href: REPO, icon: GithubIcon, primary: true },
            // {
            //   label: "The 2003 paper",
            //   href: "https://www.ee.columbia.edu/~dpwe/papers/Wang03-shazam.pdf",
            //   icon: DocIcon,
            // },
          ]}
        />
      </div>

      {/* ------------------------------- Overview ------------------------------ */}

      <PaperSection title="Overview">
        <Prose>
          <p>
            Shazam never compares audio to audio. It reduces each track to a sparse set of
            landmark points, encodes <em>pairs</em> of them as integers, and turns recognition
            into a database lookup. A noisy ten-second phone recording shares almost no waveform
            with the studio master, but it shares those integers.
          </p>
          <p>
            This is a recreation of that system, built over a semester with the Michigan Data
            Science Team. Raw audio runs through a constellation map, a 32-bit hash, and a SQLite
            index, then out to a React Native app that listens through the phone microphone.
          </p>
        </Prose>
      </PaperSection>

      {/* ------------------------------- Pipeline ------------------------------ */}

      <PaperSection title="The pipeline">
        <Diagram caption="Recognition and ingest share the first three stages. Only the last step differs: one writes hashes, the other looks them up.">{`  microphone recording (.m4a / .wav)          YouTube URL
       │                                          │
       │  ffmpeg  → 44.1 kHz mono flac            │  yt-dlp → flac
       ▼                                          ▼
  preprocess_audio()   librosa resample to 11.025 kHz mono
       │
       │  compute_stft()      1024-sample Hamming window, hop 1536
       ▼
  spectrogram  (513 freq bins × T time bins)
       │
       │  const_map.py        banded peak picking + dedup
       ▼
  constellation map          ~sparse (time, frequency) landmarks
       │
       │  hasher.py           pair each anchor with its target zone
       ▼
  32-bit fingerprints        {hash: (anchor_time, song_id)}
       │
       ├──────────────► DB_adder.py    INSERT INTO hashes      (ingest)
       │
       ▼
  search.py                  bin matches by song, histogram the offsets
       │
       ▼
  ranked (song_id, score)`}</Diagram>
      </PaperSection>

      {/* ------------------------------ Spectrogram ---------------------------- */}

      <PaperSection title="Spectrogram">
        <Prose>
          <p>
            A waveform is one number per sample: air pressure over time. It records that the
            audio got louder, not whether that was a bass note or a cymbal. Two unrelated songs
            can share almost the same envelope, so there is nothing in the raw signal worth
            matching on.
          </p>
          <p>
            A short-time Fourier transform converts it into frequency content over time. The
            audio is cut into short windows, each window is tapered by a Hamming curve so its
            abrupt edges do not smear energy across the spectrum, and each is decomposed into
            frequency components. Keeping the magnitude and discarding phase leaves a
            two-dimensional grid of loudness indexed by frequency and time.
          </p>
        </Prose>

        <ResultsTable
          head={["Parameter", "Value"]}
          rows={[
            ["Resample rate", "11,025 Hz"],
            ["Window size", "1024 samples"],
            ["Window function", "Hamming"],
            ["Hop length", "1536 samples"],
          ]}
          caption="Resampling to 11,025 Hz caps the usable spectrum at half that rate, which is what the 10-bit frequency field in the hash is sized against."
        />

        <div className="mt-10">
          <Prose>
            <p>
              The hop is larger than the window, so consecutive windows do not overlap and the
              512 samples between them go unanalyzed. Most STFT setups overlap windows by half or
              more.
            </p>
            <p>
              Everything downstream runs on this grid rather than on audio. Peaks are picked from
              it, a landmark is a{" "}
              <Math>{String.raw`(\text{time bin}, \text{frequency})`}</Math> coordinate, and those
              coordinates are what get hashed.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* --------------------------- Constellation map ------------------------- */}

      <PaperSection title="Constellation map">
        <Prose>
          <p>
            A spectrogram holds far too much data to index, and most of it is noise-sensitive.
            The constellation map keeps only local maxima: the few points per window that are loud
            relative to their neighborhood. These survive compression, reverb, and a phone
            microphone, because a peak stays a peak even as the noise floor rises around it.
          </p>
          <p>
            Taking the globally loudest points fails, because loudness is not evenly distributed.
            Human hearing amplifies low frequencies, so a plain top-N returns mostly bass. A
            chorus is louder than an intro, so it also returns mostly chorus.
          </p>
          <p>
            The fix is to window along both axes: slide across time, and within each window take
            the top candidates from each frequency band independently. The bands are deliberately
            uneven.
          </p>
        </Prose>

        <div className="mx-auto mt-8 max-w-3xl">
          <CodeBlock>{`bands = [(0, 10), (10, 20), (20, 40), (40, 80), (80, 160), (160, 512)]`}</CodeBlock>
        </div>

        <div className="mt-8">
          <Prose>
            <p>
              Roughly logarithmic, matching how pitch is perceived. Narrow low bands stop the bass
              from crowding everything out; the wide top band covers the sparse high end. A final
              pass drops any peak within 10 time bins and 300 Hz of an earlier one, so one loud
              transient yields a single landmark instead of a cluster.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* ------------------------------- Hashing ------------------------------- */}

      <PaperSection title="Fingerprint hashing">
        <Prose>
          <p>
            A single peak is not distinctive, since plenty of songs have energy at 440 Hz. A{" "}
            <em>pair</em> of peaks plus the gap between them is far rarer. Each anchor is paired
            with every peak in a zone ahead of it, and each pair becomes one fingerprint.
          </p>
        </Prose>

        <FigureFrame caption="Four peaks in the zone means four hashes from this one anchor. That yields far more fingerprints than there are peaks, which is what buys robustness.">
          <ConstellationFigure />
        </FigureFrame>

        <div className="mt-10">
          <Prose>
            <p>
              The zone is bounded on both axes: 100 time bins ahead, 1500 Hz either side. Peaks
              are sorted by time, so the loop can <code className={mono}>break</code> rather than{" "}
              <code className={mono}>continue</code> once it passes the time bound, turning the
              inner scan into a short one.
            </p>
            <p>
              The pair is packed into one 32-bit integer, the key the database is indexed on:
            </p>
          </Prose>
        </div>

        <FigureFrame
          maxWidth={700}
          caption="Frequencies are rescaled to fit 10 bits each. At 11.025 kHz, Nyquist caps frequency at 5512.5 Hz, so each step is about 5.4 Hz: coarse enough to survive a lossy recording, fine enough to stay discriminative."
        >
          <HashLayoutFigure />
        </FigureFrame>

        <div className="mt-10">
          <Prose>
            <p>
              The quantization is the point, not a compromise. Two recordings of the same moment
              never produce identical frequency estimates. Rounding them into the same bucket is
              what lets a phone recording hash to the same integer as the master.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* --------------------------- Search and scoring ------------------------ */}

      <PaperSection title="Search and scoring">
        <Prose>
          <p>
            Looking up the sample&apos;s hashes returns many matches, most of them coincidental.
            With a 32-bit key and millions of stored fingerprints, collisions are guaranteed, so a
            raw match count is a weak signal. A <em>real</em> match has structure that a
            coincidental one does not.
          </p>
          <p>
            If the sample came from a track, every matching landmark sits at the same relative
            offset. Plot source time against sample time and the true matches fall on a line of
            slope 1 while the coincidences scatter. Since the slope is known, detecting that line
            means histogramming
          </p>
        </Prose>

        <MathBlock tag="1">
          {String.raw`\Delta T = \text{sourceT} - \text{sampleT}`}
        </MathBlock>

        <div className="mt-2">
          <Prose>
            <p>and looking for a spike. The height of that spike is the score.</p>
          </Prose>
        </div>

        <FigureFrame caption="The diagonal collapses to one tall bar once the offsets are histogrammed. Coincidental matches spread thin across every bin; real ones pile into a single bin.">
          <MatchScoringFigure />
        </FigureFrame>

        <div className="mt-10">
          <Prose>
            <p>
              Time pairs go into a <code className={mono}>defaultdict(set)</code> keyed by song
              id. A set rather than a list, because several hashes can produce the same{" "}
              <Math>{String.raw`(\text{sourceT}, \text{sampleT})`}</Math> pair and it should only
              count once. Scoring each bin is then one{" "}
              <code className={mono}>np.histogram</code> and one{" "}
              <code className={mono}>.max()</code>.
            </p>
          </Prose>
        </div>

        <div className="mx-auto max-w-3xl">
          <CodeBlock>{`deltaT_values = [sourceT - sampleT for (sourceT, sampleT) in time_pair_bin]
hist, _ = np.histogram(
    deltaT_values,
    bins=max(len(np.unique(deltaT_values)), 10),
)
scores[song_id] = hist.max()`}</CodeBlock>
        </div>

        <Callout label="Why this holds up">
          The score counts landmarks agreeing on one alignment, so it degrades gracefully. Noise
          removes landmarks and lowers the spike, but it does not move the survivors. That is why
          a recording which sounds bad to a person can still match decisively.
        </Callout>
      </PaperSection>

      {/* ------------------------------ Database ------------------------------- */}

      <PaperSection title="Storage and ingest">
        <Prose>
          <p>
            Two SQLite tables. <code className={mono}>songs</code> holds metadata (YouTube URL,
            title, artist, artwork, duration); <code className={mono}>hashes</code> holds
            fingerprints as <code className={mono}>(hash_val, time_stamp, song_id)</code>. Ingest
            inserts the metadata row, takes the id back from{" "}
            <code className={mono}>last_insert_rowid()</code>, then stamps it onto every
            fingerprint the track produces.
          </p>
          <p>
            Adding a song by URL runs unattended: yt-dlp pulls the audio, the YouTube oEmbed
            endpoint supplies title, artist, and artwork, the fingerprints are computed and
            written, and the audio file is deleted. Only the hashes are kept. A track collapses
            from megabytes of audio to a set of integers, and the original is never needed again.
          </p>
        </Prose>
      </PaperSection>

      {/* -------------------------- Serving and the app ------------------------ */}

      <PaperSection title="Serving it to a phone">
        <Prose>
          <p>
            A Flask API exposes two endpoints. <code className={mono}>/predict</code> takes an
            uploaded recording and returns the best match with its score, YouTube URL, and title.{" "}
            <code className={mono}>/add_song</code> takes a URL and ingests it.
          </p>
          <p>
            The awkward part is the format boundary. React Native records to{" "}
            <code className={mono}>.m4a</code> or <code className={mono}>.webm</code> depending on
            platform, so the endpoint shells out to ffmpeg and normalizes every upload to mono
            flac before librosa touches it. Recording happens at 44.1 kHz and is immediately
            resampled to 11.025 kHz. Discarding the top of the spectrum is deliberate: the
            landmarks live well below it, and the smaller array makes the STFT cheaper.
          </p>
          <p>
            The client is an Expo / React Native app: hold to record, upload, and on a hit it
            renders the matched track in an embedded YouTube player. A text field posts a URL
            straight to <code className={mono}>/add_song</code>, so the library can be grown from
            the phone.
          </p>
        </Prose>
      </PaperSection>

      {/* -------------------------------- Tuning ------------------------------- */}

      <PaperSection title="Tuning">
        <Prose>
          <p>
            Peak-picking has several interacting knobs: window size, candidates per band, band
            edges, and the two fan-out bounds. More peaks means more hashes, which means better
            recall and a bigger, slower database. The parameters live in a JSON file that both the
            mapper and the hasher read at call time, so a grid search can rewrite them between
            runs without touching the code.
          </p>
          <p>
            Evaluation uses a real microphone recording rather than a clean track. It is sliced
            into twenty five-second samples, each augmented with brownian noise, and scored on
            whether the top-ranked song is correct. Brownian rather than white, because its energy
            concentrates at low frequencies, where room rumble actually lives.
          </p>
        </Prose>

        <ResultsTable
          head={["Metric", "Reads as"]}
          rows={[
            [
              <>
                <code className={mono}>histogram_max_height</code>
              </>,
              "landmarks agreeing on one offset; the score itself",
            ],
            [
              <>
                <code className={mono}>std_of_deltaT</code>
              </>,
              "spread of offsets in ms; lower means a tighter diagonal",
            ],
            [
              <>
                <code className={mono}>n_hash_matches</code>
              </>,
              "raw match count, before alignment is considered",
            ],
            [
              <>
                <code className={mono}>prop_hash_matches</code>
              </>,
              "matches as a fraction of the sample's own hashes",
            ],
          ]}
          caption="Four numbers per candidate, computed for the top five songs on every sample. The score alone cannot separate a confident match from a lucky one, so the offset spread is tracked alongside it."
        />

        <div className="mt-10">
          <Prose>
            <p>
              Keeping <code className={mono}>std_of_deltaT</code> beside the score makes a wrong
              answer diagnosable. Tightly clustered offsets mean a genuine match; offsets smeared
              across a second mean a song that merely shares a lot of hashes. The ranking alone
              hides that difference.
            </p>
          </Prose>
        </div>
      </PaperSection>

      <div className="mt-20 border-t border-[var(--border)] pt-10 text-center">
        <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary group">
          {GithubIcon}
          GitHub
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </article>
  );
}
